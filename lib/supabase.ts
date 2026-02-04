
import { createClient } from '@supabase/supabase-js';

// Estas variables deben estar en tu archivo .env
// VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
// VITE_SUPABASE_ANON_KEY=tu-anon-key-publica

// Usamos optional chaining para evitar errores si import.meta.env es undefined
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Si no están configuradas, el cliente será null y usaremos el modo offline/mock
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = () => !!supabase;
