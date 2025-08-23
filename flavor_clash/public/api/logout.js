// /logout.js
import { supabase } from './supabaseClient.js';

// Llama a Supabase + limpia y redirige
export async function doLogout(redirect = 'login.html') {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.warn('[logout] signOut error:', error.message);
  } catch (e) {
    console.error('[logout] exception:', e);
  }
  // Por si acaso hay algo cacheado
  try { localStorage.removeItem('supabase.auth.token'); } catch {}
  location.replace(redirect);
}

// Delegación: cualquier elemento con data-logout dispara logout
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-logout]');
  if (!el) return;
  e.preventDefault();
  doLogout(el.getAttribute('data-logout') || 'login.html');
});
