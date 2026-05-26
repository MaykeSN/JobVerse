import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fica null se .env ainda não está configurado — permite dev sem backend.
export const supabase: SupabaseClient | null =
  url && key && url.startsWith('https://') ? createClient(url, key) : null;

export const supabaseConfigurado = supabase !== null;
