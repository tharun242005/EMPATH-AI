/**
 * Smart Notification Monitor for EmpathAI
 * Detects harassment in incoming notifications and triggers supportive responses
 */

import { toast } from "sonner";

const HARASSMENT_KEYWORDS = {
  high: ["rape", "molest", "kill", "assault", "sexual", "threat", "stalker", "violence", "harm", "attack"],
  medium: ["abuse", "harass", "touch", "dirty", "flirt", "blackmail", "bully", "intimidate", "coerce"],
  low: ["insult", "idiot", "stupid", "annoying", "mean", "hate", "rude", "nasty", "disgusting"],
};

let notificationPermissionGranted = false;
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 60000; // 60 seconds

/**
 * Initialize the notification monitor system
 * Only starts listener if permission is already granted and toggle is ON
 * Does NOT auto-request permission (that's handled by Settings toggle)
 */
export async function initNotificationMonitor(): Promise<void> {
  // Check if notifications are enabled in settings
  const isEnabled = localStorage.getItem("notificationsEnabled") === "true";
  if (!isEnabled) {
    console.log("🔕 Notifications disabled in settings");
    return; // Only run if toggle is ON
  }

  if (!("Notification" in window)) {
    console.warn("❌ Browser does not support Notifications API");
    return;
  }

  // Only start listener if permission is already granted
  // Permission request is handled by Settings toggle, not here
  if (Notification.permission === "granted") {
    setupListener();
    return;
  }

  console.log("🔕 Notifications not granted yet. Enable via Settings toggle.");
}

/**
 * Request permission with retry logic
 */
async function requestPermissionWithRetry(): Promise<void> {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      notificationPermissionGranted = true;
      retryCount = 0; // Reset retry count on success
      toast.success("🔔 Notifications enabled — EmpathAI is watching out for you 💜");
      setupListener();
      return;
    }

    if (permission === "denied") {
      toast.error("⚠️ Notifications are blocked — please enable them in browser settings.");
      return;
    }

    // Permission is "default" (user dismissed the prompt)
    retryCount++;
    if (retryCount <= MAX_RETRIES) {
      toast("🔔 Reminder: EmpathAI needs notification access to protect you.", {
        duration: 5000,
      });
      // Retry after delay
      setTimeout(() => {
        requestPermissionWithRetry();
      }, RETRY_DELAY_MS);
    } else {
      console.warn("⚠️ Max retry attempts reached for notification permission");
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
  }
}

/**
 * Setup the notification listener (only called when permission is granted)
 */
function setupListener(): void {
  if (!notificationPermissionGranted && Notification.permission !== "granted") {
    return;
  }

  notificationPermissionGranted = true;

  // Register service worker for push notifications
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ EmpathAI Service Worker registered:", registration);
        if (registration.active) {
          console.log("⚡ Active worker is running");
        }
      })
      .catch((error) => {
        console.warn("⚠️ Service Worker registration failed:", error);
        // Continue without service worker - we can still use Notification API
      });

    // Optional: register periodic sync to keep worker active (if supported)
    navigator.serviceWorker.ready
      .then((reg: ServiceWorkerRegistration & { periodicSync?: { register: (tag: string, opts: { minInterval: number }) => Promise<void> } }) => {
        if (reg.periodicSync && typeof reg.periodicSync.register === "function") {
          reg.periodicSync.register("keep-alive", { minInterval: 60 * 1000 }).catch(() => {});
        }
      })
      .catch(() => {});
  }

  console.log("🔍 Notification monitor active...");

  // Listen for custom notification events (can be triggered by external sources)
  window.addEventListener("empathai-notification", handleNotificationEvent);
}

/**
 * Handle incoming notification event
 */
async function handleNotificationEvent(evt: Event): Promise<void> {
  try {
    const event = evt as CustomEvent;
    const title = (event as any).detail?.title || "";
    const message = (event as any).detail?.message || "";
    const text = `${title} ${message}`.toLowerCase();

    // Detect harassment level
    let level = "Low";
    for (const [severity, keywords] of Object.entries(HARASSMENT_KEYWORDS)) {
      if (keywords.some((word) => text.includes(word))) {
        level = severity.charAt(0).toUpperCase() + severity.slice(1);
        break;
      }
    }

    // Only trigger if harassment is detected (Medium or High)
    if (level === "Medium" || level === "High") {
      console.log(`🚨 Harassment detected: ${level} → ${message}`);

      try {
        // Call backend to get supportive message
        const response = await fetch("http://127.0.0.1:8000/api/trigger-support", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            severity: level,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data?.reply || "I'm here to support you 💜";

        // Show supportive notification
        await showSupportiveNotification(level, reply);
      } catch (error) {
        console.error("⚠️ Backend trigger failed:", error);
        // Fallback to default supportive message
        const fallbackMessage = getFallbackSupportMessage(level);
        await showSupportiveNotification(level, fallbackMessage);
      }
    }
  } catch (error) {
    console.error("❌ Error handling notification:", error);
  }
}

/**
 * Get fallback supportive message if backend fails
 */
function getFallbackSupportMessage(level: string): string {
  if (level === "High") {
    return "This sounds extremely serious. Please prioritize your safety. I'm here to support you 💜";
  } else if (level === "Medium") {
    return "That message sounds really hurtful. I'm here to support you. You deserve to feel safe 💜";
  }
  return "I noticed something that might be bothering you. I'm here to listen 💜";
}

/**
 * Show supportive browser notification
 */
async function showSupportiveNotification(level: string, reply: string): Promise<void> {
  if (Notification.permission !== "granted" || !notificationPermissionGranted) {
    console.warn("⚠️ Cannot show notification: permission not granted");
    return;
  }

  try {
    const title = `EmpathAI Support 💜 (${level} Alert)`;
    const encodedReply = encodeURIComponent(reply);
    const chatUrl = `/chat?auto=true&msg=${encodedReply}`;

    // Use service worker if available, otherwise use Notification API directly
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body: reply,
          icon: "/icon.png",
          tag: "empathai-support",
          data: { url: chatUrl },
          requireInteraction: level === "High",
          badge: "/icon.png",
        });
        return;
      } catch (error) {
        console.warn("⚠️ Service Worker notification failed, using fallback:", error);
        try {
          // Explicit attempt as requested to wake the SW and show basic notification
          await navigator.serviceWorker.ready
            .then((registration) => {
              return registration.showNotification("EmpathAI 💜", {
                body: reply,
                icon: "/icon.png",
                tag: "empathai-support",
                data: { url: chatUrl },
              });
            })
            .catch((err) => {
              console.error("Service worker not ready:", err);
              toast.error("Failed to send EmpathAI notification");
            });
        } catch {
          // Ignore; fallback below will attempt Notification API
        }
      }
    }

    // Fallback to direct Notification API
    const notification = new Notification(title, {
      body: reply,
      icon: "/favicon.ico",
      tag: "empathai-support",
      requireInteraction: level === "High",
    });

    // Handle click to open chat
    notification.onclick = () => {
      window.focus();
      window.location.href = chatUrl;
      notification.close();
    };
  } catch (error) {
    console.error("❌ Error showing notification:", error);
  }
}

/**
 * Simulate incoming notification (for testing)
 */
export function simulateIncomingNotification(title: string, message: string): void {
  const event = new CustomEvent("empathai-notification", {
    detail: { title, message },
  });
  window.dispatchEvent(event);
}

/**
 * Check if notification permission is granted
 */
export function hasNotificationPermission(): boolean {
  return notificationPermissionGranted && Notification.permission === "granted";
}

// Expose to window for dev testing
// @ts-ignore
window.simulateIncomingNotification = simulateIncomingNotification;
