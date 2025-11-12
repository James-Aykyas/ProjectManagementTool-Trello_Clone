import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  background_color: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  title: string;
  board_id: string;
  position: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  list_id: string;
  position: number;
  due_date?: string;
  assignee_id?: string;
  labels?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BoardMember {
  id: string;
  board_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}