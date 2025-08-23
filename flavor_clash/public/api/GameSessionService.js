// /public/api/GameSessionService.js
import { supabase } from '../supabaseClient.js';

const GameSessionService = {
  async start(deckId = 'classic') {
    // 1) Intenta vía RPC (recomendado)
    const { data, error } = await supabase.rpc('start_game', { p_deck_id: deckId });
    if (!error && data) return data;

    // 2) Fallback: insert directo (por si el RPC no existe)
    const { data: { user }, error: e1 } = await supabase.auth.getUser();
    if (e1) throw e1;
    if (!user) throw new Error('No hay sesión');

    const { data: row, error: e2 } = await supabase
      .from('game_sessions')
      .insert({
        user_id: user.id,
        deck_id: deckId,
        score: 0,
        turns_played: 0,
        finished: false,
      })
      .select()
      .single();

    if (e2) throw e2;
    return row;
  },

  async update(id, patch) {
    const { data, error } = await supabase
      .from('game_sessions')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async myLast(limit = 10) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },
};

export default GameSessionService;
