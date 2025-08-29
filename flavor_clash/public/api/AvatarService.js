import { supabase } from '../supabaseClient.js';

const BUCKET = 'avatars';

const AvatarService = {
  async uploadAvatar(file) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('No session');
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
      upsert: true,
    });
    if (error) throw error;
    return filePath;
  },

  async getAvatarUrl(path) {
    if (!path) return null;
    // if path is relative to local assets, return as is
    if (path.startsWith('avatars/')) return path;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
    if (error) throw error;
    return data.signedUrl;
  }
};

export default AvatarService;
