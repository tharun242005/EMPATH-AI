/**
 * Real Windows notification bridge (UWP via edge-js)
 * Falls back gracefully if DLL not found or permission denied.
 */

import edge from "electron-edge-js";
import { detectSeverity } from "../../shared/harassment.js";
import { triggerSupport } from "../../shared/backend.js";

export async function startWindowsNotificationBridge(cb: {
  onSupportNotice: (text: string, link?: string) => void;
}) {
  console.log("🟢 Starting EmpathAI WinBridge...");

  try {
    const startListening = edge.func({
      assemblyFile: "./winbridge/EmpathAI.WinBridge.dll",
      typeName: "EmpathAI.WinBridge.NotificationBridge",
      methodName: "StartListening"
    });

    startListening(null, (err: any) => {
      if (err) {
        console.error("WinBridge Error:", err);
        cb.onSupportNotice("EmpathAI: Unable to access notifications.");
      } else {
        console.log("✅ WinBridge connected successfully.");
      }
    });
  } catch (e) {
    console.error("⚠️ WinBridge failed:", e);
    cb.onSupportNotice("EmpathAI running in safe mode (mock listener).");
  }
}


