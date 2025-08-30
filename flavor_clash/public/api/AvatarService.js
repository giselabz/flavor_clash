// /api/AvatarService.js
import { supabase } from '../supabaseClient.js';

const BUCKET = 'Avatars';
const CACHE_PREFIX = 'sb:avatarSigned:';

function getCache(path) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + path);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj.exp > Date.now() + 5_000) return obj.u; // margen 5s
  } catch {}
  return null;
}

function setCache(path, url, expiresInSec) {
  try {
    const exp = Date.now() + (expiresInSec * 1000) - 60_000; // -1min margen
    localStorage.setItem(CACHE_PREFIX + path, JSON.stringify({ u: url, exp }));
  } catch {}
}

const AvatarService = {
  async uploadAvatar(file) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('No session');

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const filePath = `${session.user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase
      .storage
      .from(BUCKET)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;
    return filePath; // guarda este path en users.avatar_url
  },

  // Devuelve URL (pública si el bucket lo es) o firmada con caché (si es privado)
  async getAvatarUrl(path, { expiresIn = 21600 } = {}) { // 6 h
    if (!path) return null;

    // Predefinidos (carpeta local)
    if (path.startsWith('avatars/')) return path;

    // Intento público (por si el bucket es público)
    try {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      if (data?.publicUrl) return data.publicUrl;
    } catch { /* seguimos con firmada */ }

    // Caché local de firmada
    const cached = getCache(path);
    if (cached) return cached;

    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    setCache(path, data.signedUrl, expiresIn);
    return data.signedUrl;
  },
};

export default AvatarService;
