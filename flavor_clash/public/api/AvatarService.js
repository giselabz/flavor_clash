// /services/AvatarService.js
import { supabase } from '../supabaseClient.js';

const BUCKET = 'Avatars';

const AvatarService = {
  async uploadAvatar(file) {
    // 1) Comprobar sesión
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('No session');

    // 2) Ruta "carpeta por usuario" + timestamp
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const filePath = `${session.user.id}/${Date.now()}.${ext}`;
    debugger;

    // 3) Subir con supabase-js (cliente)
    const { error: uploadError } = await supabase
      .storage
      .from(BUCKET)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;

    return filePath; // guarda este path en tu tabla (p.ej. users.avatar_path)
  },

  async getAvatarUrl(path) {
    if (!path) return null;

    // Si usas bucket público, mejor:
    // const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    // return data.publicUrl;

    // Si el bucket es privado, usa URL firmada:
    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .createSignedUrl(path, 60); // 60s

    if (error) throw error;
    return data.signedUrl;
  }
};

export default AvatarService;
