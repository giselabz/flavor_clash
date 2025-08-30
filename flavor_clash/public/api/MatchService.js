// /api/MatchService.js
import { supabase } from '../supabaseClient.js';

async function getAuthUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('No authenticated user');
  return user.id;
}

const MatchService = {
  async recordMatch({ score = 0, dishesCreated = 0, pairingsMade = 0, deckId = null, durationSecs = null, meta = null }) {
    const userId = await getAuthUserId();

    const { error: insErr } = await supabase.from('match_history').insert({
      user_id: userId,
      score,
      dishes_created: dishesCreated,
      pairings_made: pairingsMade,
      deck_id: deckId,
      duration_secs: durationSecs,
      meta
    });
    if (insErr) throw insErr;

    const { error: rpcErr } = await supabase.rpc('increment_user_stats', {
      p_user_id: userId,
      p_points: score,
      p_dishes: dishesCreated,
      p_pairings: pairingsMade
    });
    if (rpcErr) throw rpcErr;

    return true;
  },

  async getMyRecentMatches(limit = 10) {
    const userId = await getAuthUserId();
    const { data, error } = await supabase
      .from('match_history')
      .select('played_at, score, dishes_created, pairings_made, deck_id')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  }
};

export default MatchService;
