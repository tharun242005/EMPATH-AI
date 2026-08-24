/**
 * Service Worker for EmpathAI
 * Handles push notifications and notification clicks
 */

self.addEventListener("install", (event) => {
  console.log("✅ EmpathAI Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ EmpathAI Service Worker activated and ready");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  console.log("🔗 Notification clicked");
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/chat")) {
          return client.focus();
        }
      }
      return clients.openWindow("/chat?auto=true&msg=Hey%2C%20I%20noticed%20something%20distressing.%20I%E2%80%99m%20here%20for%20you%20%F0%9F%92%9C");
    })
  );
});

self.addEventListener("push", (event) => {
  console.log("📨 Push event received:", event.data?.text());
  const data = event.data?.json() || {};
  const title = data.title || "EmpathAI 💜";
  const options = {
    body: data.body || "Hey, I noticed something distressing. I’m here for you 💜",
    icon: data.icon || "/icon.png",
    badge: "/icon.png",
    tag: data.tag || "empathai-support",
    vibrate: [100, 50, 100],
    data: data.data || { url: "/chat" },
    requireInteraction: data.requireInteraction || false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Keep the service worker alive periodically
setInterval(() => {
  self.registration.getNotifications().then(() => {
    console.log("🕒 Keeping EmpathAI Service Worker alive...");
  });
}, 25000);
