import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (matching our schema)
export interface UserProfile {
  id: string;
  name: string;
  dob: string;
  gender: 'male' | 'female';
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  unit_system: 'metric' | 'imperial';
  daily_calorie_limit: number;
  user_goal: 'lose' | 'maintain' | 'gain';
  active_character_id: string;
  current_level: number;
  current_xp: number;
  max_xp: number;
  inventory: string[];
  equipped_accessory: string | null;
  streak_days: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string | null;
  icon: string;
  display_amount: string | null;
  ai_feedback: string | null;
  zpd_status: string | null;
  image_url: string | null;
  timestamp: string;
  log_date: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  category: 'workout' | 'meditation';
  title: string;
  icon: string;
  duration_minutes: number;
  duration_text: string;
  calories_burned: number | null;
  color: string | null;
  timestamp: string;
  log_date: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  timestamp: string;
  log_date: string;
  created_at: string;
}

export interface FastingLog {
  id: string;
  user_id: string;
  protocol: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  duration_text: string | null;
  log_date: string;
  created_at: string;
}

