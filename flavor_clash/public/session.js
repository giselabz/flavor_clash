// /session.js
import UserService from './api/UserService.js';

export async function requireAuth(redirectTo = 'login.html') {
  const session = await UserService.getSession().catch(() => null);
  if (!session) {
    const next = encodeURIComponent(location.pathname.replace(/^\/+/, '') + location.search);
    location.href = `${redirectTo}?next=${next}`;
    return false;
  }
  return true;
}

export async function redirectIfAuthed(redirectTo = 'mainMenu.html') {
  const session = await UserService.getSession().catch(() => null);
  if (session) {
    location.replace(redirectTo);
    return true;
  }
  return false;
}

export function startAuthListener() {
  UserService.onAuthChange((_e, s) => {
    const el = document.querySelector('[data-authstate]');
    if (el) el.textContent = s ? 'online' : 'offline';
  });
}
