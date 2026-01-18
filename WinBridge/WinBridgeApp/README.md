# EmpathAI.WinBridge

Build steps
1. Open this folder in Visual Studio.
2. Set Configuration to Debug and Platform to x64.
3. Build the project. Output files appear in:
   bin/x64/Debug/

Copy these into the Electron app:
- Copy EmpathAI.WinBridge.dll and EmpathAI.WinBridge.winmd to desktop/winbridge/

Notes
- Enable Windows Developer Mode for full functionality.
- For distribution, sign the DLL with a certificate and add it to Trusted Root CAs.


