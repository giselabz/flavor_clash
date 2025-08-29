import { supabase } from '../supabaseClient.js';
const UserService = {
  async signUp(email, password, name, avatarUrl) {
    const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ name, avatar_url: avatarUrl } } });
    if (error) throw error;
    const user = data.user;
    if (user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: user.id, name, avatar_url: avatarUrl });
      if (insertError) console.error(insertError);
    }
    return data;
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
    const { data, error } = await supabase
      .from('users')
      .upsert({ id: user.id, ...updates })
      .select()
      .single();
    if (error) throw error;
    if (updates.avatar_url) {
      const { error: authError } = await supabase.auth.updateUser({ data: { avatar_url: updates.avatar_url } });
      if (authError) console.error(authError);
    }
    return data;
  }
}; export default UserService;
