import { supabase } from '../supabaseClient.js';
const UserService = {
  async signUp(email, password, name, avatar) {
    const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ name, avatar } } });
    if (error) throw error; return data;
  },
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error; return data;
  },
  async signOut() { const { error } = await supabase.auth.signOut(); if (error) throw error; },
  onAuthChange(cb){ return supabase.auth.onAuthStateChange((_e, s)=>cb(s)); },
  async getSession(){ const { data:{ session }, error } = await supabase.auth.getSession(); if (error) throw error; return session; },
  async getMyProfile(){
    const { data:{ user }, error:e1 } = await supabase.auth.getUser(); if (e1) throw e1; if (!user) return null;
    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (error) throw error; return data;
  },
  async updateMyProfile(updates){
    const { data:{ user }, error:e1 } = await supabase.auth.getUser(); if (e1) throw e1; if (!user) throw new Error('No session');
    const { data, error } = await supabase.from('users').update(updates).eq('id', user.id).select().single();
    if (error) throw error; return data;
  }
}; export default UserService;
