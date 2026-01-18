import axios from 'axios';

// Works in Vite (web) and Node (desktop/mobile)
// Vite exposes import.meta.env.*, Node picks process.env.*
const BASE_URL =
  // @ts-ignore - optional in Node
  (typeof import !== 'undefined' && (import.meta as any)?.env?.VITE_API_BASE) ||
  process.env.API_BASE ||
  'http://127.0.0.1:8000';

export async function triggerSupport(payload: {
  source: 'windows' | 'android';
  title?: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High';
  user_id?: string;
  hits?: string[];
}) {
  try {
    await axios.post(`${BASE_URL}/api/trigger-support`, payload, { timeout: 10000 });
  } catch {
    // best-effort; local client still notifies
  }
}


