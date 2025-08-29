import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { scoreCombination } from "./scoring.ts";

serve(async (req: Request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'not_authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { plate } = await req.json();
  const score = scoreCombination(plate);
  return new Response(JSON.stringify({ score }), { headers: { 'Content-Type': 'application/json' } });
});
