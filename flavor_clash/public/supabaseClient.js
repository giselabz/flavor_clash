// /public/supabaseClient.js
// Importa el client de Supabase des d'un CDN quan s'executa al
// navegador. En entorns de test (Node) exporta un stub per evitar
// dependències externes.

let supabase;
if (typeof window !== 'undefined') {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');

  const SUPABASE_URL = 'https://dowrmefskcvrqgjiavtf.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvd3JtZWZza2N2cnFnamlhdnRmIiwi\
cm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODEzNDcsImV4cCI6MjA2NzY1NzM0N30.HfPEDIrxk3dUOG16bZACYlo7TyzAQGl3HNYmkATovlk';

  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
  });

  // Log de verificació al navegador
  console.log('[supabase] client ready:', SUPABASE_URL);
} else {
  // Stub senzill per l'entorn de proves
  supabase = {};
}

export { supabase };
