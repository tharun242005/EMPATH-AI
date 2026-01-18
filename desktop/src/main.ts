import { app, Tray, Menu, Notification, shell } from 'electron';
import path from 'node:path';
import AutoLaunch from 'auto-launch';
import { startWindowsNotificationBridge } from './win-notifications';

let tray: Tray | null = null;

function showLocalSupportNotice(body: string, clickUrl?: string) {
  const n = new Notification({
    title: 'EmpathAI is here for you 💜',
    body,
    silent: false
  });
  if (clickUrl) n.on('click', () => shell.openExternal(clickUrl));
  n.show();
}

async function createTray() {
  const icon = path.join(app.isPackaged ? process.resourcesPath : __dirname, '../assets/icon.ico');
  tray = new Tray(icon);
  const menu = Menu.buildFromTemplate([
    { label: 'Open Chat', click: () => shell.openExternal('http://localhost:3000/chat') },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('EmpathAI — proactive support');
  tray.setContextMenu(menu);
}

async function ensureAutoLaunch() {
  const launcher = new AutoLaunch({ name: 'EmpathAI Desktop' });
  const enabled = await launcher.isEnabled();
  if (!enabled) {
    try { await launcher.enable(); } catch {}
  }
}

app.whenReady().then(async () => {
  await ensureAutoLaunch();
  await createTray();

  startWindowsNotificationBridge({
    onSupportNotice: (text: string, deepLink?: string) => {
      showLocalSupportNotice(text, deepLink);
    }
  });
});

app.on('window-all-closed', (e) => {
  // tray app; keep running
  e.preventDefault();
});


