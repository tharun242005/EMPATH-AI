import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Create Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Types for our database tables
export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

export interface Interaction {
  id: string;
  user_id: string;
  emotion: string;
  severity: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  created_at: string;
}
