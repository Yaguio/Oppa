import { createClient } from '@supabase/supabase-js';

// Garantindo que a URL seja sempre uma string válida que comece com http
const defaultUrl = 'https://mlgvgwkdvjzyouwtggux.supabase.co';
const envUrl = import.meta.env.VITE_SUPABASE_URL;

// Verifica se a URL do ambiente existe e se parece com uma URL válida
const isValidUrl = (url: any) => typeof url === 'string' && url.trim().startsWith('http');
const supabaseUrl = isValidUrl(envUrl) ? envUrl!.trim() : defaultUrl;

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZ3Znd2tkdmp6eW91d3RnZ3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDA1ODQsImV4cCI6MjA5MDkxNjU4NH0.CnIKIkM300CN3OfUOpDJoRx36F_Or5lADfidxcsdkC8';

if (!supabaseKey) {
  console.warn('Supabase Warning: VITE_SUPABASE_ANON_KEY não está definida.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
