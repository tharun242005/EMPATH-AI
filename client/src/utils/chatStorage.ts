/**
 * Local Chat Storage Utility
 * Stores chat conversations in browser localStorage, organized by session
 */

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  emotion?: string;
  severity?: number;
  harassment_level?: string;
  harassment_confidence?: number;
  web_enabled?: boolean; // Indicates if web search was used
}

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  createdAt: number;
  messages: ChatMessage[];
}

export interface ChatHistory {
  [date: string]: ChatMessage[];
}

const STORAGE_KEY = 'empathai_chats';
const SESSIONS_KEY = 'empathai_sessions';

/**
 * Save a chat message to localStorage, organized by date
 * Prevents duplicates by checking message ID
 */
export function saveChat(date: string, message: ChatMessage): void {
  const allChats = getChats();
  
  if (!allChats[date]) {
    allChats[date] = [];
  }
  
  // Check if message already exists (prevent duplicates)
  const existingIds = new Set(allChats[date].map(m => m.id));
  if (!existingIds.has(message.id)) {
    allChats[date].push(message);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allChats));
  }
}

/**
 * Get all chats from localStorage, organized by date
 */
export function getChats(): ChatHistory {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading chats from localStorage:', error);
    return {};
  }
}

/**
 * Get chats for a specific date
 */
export function getChatsByDate(date: string): ChatMessage[] {
  const allChats = getChats();
  return allChats[date] || [];
}

/**
 * Clear all chats from localStorage
 */
export function clearChats(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Clear chats for a specific date
 */
export function clearChatsByDate(date: string): void {
  const allChats = getChats();
  delete allChats[date];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allChats));
}

/**
 * Get formatted date string (e.g., "12/25/2024")
 */
export function getFormattedDate(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Get date label for grouping (Today, Yesterday, etc.)
 */
export function getDateLabel(dateStr: string): string {
  // Parse date string in format "MM/DD/YYYY"
  const [month, day, year] = dateStr.split('/').map(Number);
  const chatDate = new Date(year, month - 1, day);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  chatDate.setHours(0, 0, 0, 0);
  
  if (chatDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (chatDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    const daysDiff = Math.floor((today.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) {
      return 'Previous 7 Days';
    } else if (daysDiff <= 30) {
      return 'This Month';
    } else {
      return chatDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }
}

/**
 * Session Management Functions
 */

/**
 * Get all sessions from localStorage
 */
export function getSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading sessions from localStorage:', error);
    return [];
  }
}

/**
 * Save a session to localStorage
 */
export function saveSession(session: ChatSession): void {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  // Sort by createdAt descending (newest first)
  sessions.sort((a, b) => b.createdAt - a.createdAt);
  
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

/**
 * Get a session by ID
 */
export function getSession(sessionId: string): ChatSession | null {
  const sessions = getSessions();
  return sessions.find(s => s.id === sessionId) || null;
}

/**
 * Delete a session
 */
export function deleteSession(sessionId: string): void {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
}

/**
 * Clear all sessions
 */
export function clearSessions(): void {
  localStorage.removeItem(SESSIONS_KEY);
}

/**
 * Update session title based on first user message
 */
export function updateSessionTitle(sessionId: string, title: string): void {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.title = title;
    saveSession(session);
  }
}

