import { supabase } from '../supabaseClient.js';

const BUCKET = 'avatars';
const UPLOAD_ENDPOINT = 'https://dowrmefskcvrqgjiavtf.storage.supabase.co/storage/v1/s3';

const AvatarService = {
  async uploadAvatar(file) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('No session');
    const ext = file.name.split('.').pop();
    const filePath = `${session.user.id}/${Date.now()}.${ext}`;
    const url = `${UPLOAD_ENDPOINT}/${BUCKET}/${filePath}`;
    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'x-upsert': 'true',
        'Content-Type': file.type
      },
      body: file
    });
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
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
