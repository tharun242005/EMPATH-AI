EmpathAI Desktop (Windows)

- Electron tray app that watches Windows notifications (WinRT via node-uwp), detects harassment, shows a supportive notification, and deep-links to the web chat.

Dev
- cd desktop
- npm i
- npm run dev

Build
- npm run build

Env
- API_BASE=http://127.0.0.1:8000 (or your backend)

Notes
- Requires Windows 10/11 and granting notification access for the app.
- If access is denied, the tray stays running and no notifications are processed.


