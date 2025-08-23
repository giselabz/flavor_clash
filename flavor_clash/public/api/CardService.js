import { supabase } from '../supabaseClient.js';
const CardService = {
  async getAll(){ const { data, error } = await supabase.from('cards').select('*').order('name',{ascending:true}); if (error) throw error; return data; },
  async byId(id){ const { data, error } = await supabase.from('cards').select('*').eq('id', id).single(); if (error) throw error; return data; },
  async byType(type){ const { data, error } = await supabase.from('cards').select('*').eq('type', type); if (error) throw error; return data; },
  async byTags(tags){ const { data, error } = await supabase.from('cards').select('*').overlaps('tags', tags); if (error) throw error; return data; },
  async byFlavor(f){ const { data, error } = await supabase.from('cards').select('*').overlaps('flavor', f); if (error) throw error; return data; },
  async byTexture(t){ const { data, error } = await supabase.from('cards').select('*').overlaps('texture', t); if (error) throw error; return data; },
}; export default CardService;
