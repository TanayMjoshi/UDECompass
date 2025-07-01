import { createClient } from '@supabase/supabase-js';

// Check if we're in demo mode (no environment variables)
export const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use demo values if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo mode warning
if (isDemoMode) {
  console.warn('Running in demo mode - Supabase features will be simulated');
}