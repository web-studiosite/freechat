import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://lseiteywfkfekohmpxeb.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZWl0ZXl3ZmtmZWtvaG1weGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NDAyNjcsImV4cCI6MjEwMzUxNjI2N30.BgZCgrZf0lW1XAMkupo9WWE2_Yvn4umpSALKm_Wvyo4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
