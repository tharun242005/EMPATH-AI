import { spawn } from 'node:child_process';

spawn('npx', ['electron', '.'], { stdio: 'inherit', cwd: process.cwd() });


