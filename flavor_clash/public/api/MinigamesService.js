import { supabase } from '../supabaseClient.js';
import UserService from './UserService.js';
const MinigamesService = {
  async saveResult({ game_type, score, feedback }){
    const s = await UserService.getSession(); const uid = s?.user?.id; if (!uid) throw new Error('No session');
    const { data, error } = await supabase.from('minigames_results').insert({ user_id: uid, game_type, score, feedback }).select().single();
    if (error) throw error; return data;
  },
  async myResults(game_type, limit=20){
    const s = await UserService.getSession(); const uid = s?.user?.id; if (!uid) return [];
    let q = supabase.from('minigames_results').select('*').eq('user_id', uid); if (game_type) q = q.eq('game_type', game_type);
    const { data, error } = await q.order('created_at',{ascending:false}).limit(limit);
    if (error) throw error; return data;
  }
}; export default MinigamesService;
