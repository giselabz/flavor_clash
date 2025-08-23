// /public/supabaseClient.js
// Importa el client de Supabase directament des d'un CDN ESM
// per evitar dependències d'import maps en cada pàgina.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://dowrmefskcvrqgjiavtf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvd3JtZWZza2N2cnFnamlhdnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODEzNDcsImV4cCI6MjA2NzY1NzM0N30.HfPEDIrxk3dUOG16bZACYlo7TyzAQGl3HNYmkATovlk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
});

// log de verificación: debe aparecer en la consola del navegador
console.log('[supabase] client ready:', SUPABASE_URL);
