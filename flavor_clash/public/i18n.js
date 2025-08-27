const translations = {
  ca: {
    nav_home: "Inici",
    nav_play: "Jugar",
    nav_shop: "Botiga",
    nav_profile: "Perfil",
    start_game: "Inicia Partida",
    play_now: "Jugar Ara",
    shop_title: "Botiga",
    profile_title: "El Meu Perfil",
    login_title: "Inicia sessió",
    login_email: "Email",
    login_password: "Contrasenya",
    login_submit: "Entrar",
    login_cancel: "Cancel·lar",
    login_no_account: "No tens compte?",
    login_register: "Registra't",
    register_title: "Crea el teu compte",
    register_intro: "Registra't amb email i contrasenya. Pots afegir nom i avatar (opcional).",
    register_name: "Nom",
    register_email: "Email *",
    register_password: "Contrasenya *",
    register_avatar: "Avatar URL",
    register_submit: "Crear compte",
    register_cancel: "Cancel·lar",
    register_have_account: "Ja tens compte?",
    register_login: "Inicia sessió"
  },
  en: {
    nav_home: "Home",
    nav_play: "Play",
    nav_shop: "Shop",
    nav_profile: "Profile",
    start_game: "Start Game",
    play_now: "Play Now",
    shop_title: "Shop",
    profile_title: "My Profile",
    login_title: "Sign In",
    login_email: "Email",
    login_password: "Password",
    login_submit: "Sign In",
    login_cancel: "Cancel",
    login_no_account: "No account?",
    login_register: "Register",
    register_title: "Create your account",
    register_intro: "Sign up with email and password. You can add name and avatar (optional).",
    register_name: "Name",
    register_email: "Email *",
    register_password: "Password *",
    register_avatar: "Avatar URL",
    register_submit: "Create account",
    register_cancel: "Cancel",
    register_have_account: "Already have an account?",
    register_login: "Sign In"
  }
};

function setLanguage(lang) {
  if (!translations[lang]) lang = 'en';
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    if (text) el.textContent = text;
  });
}

function initLanguage() {
  const saved = localStorage.getItem('lang');
  const lang = saved || navigator.language.split('-')[0];
  setLanguage(lang);
  const selector = document.getElementById('lang-select');
  if (selector) {
    selector.value = lang;
    selector.addEventListener('change', e => setLanguage(e.target.value));
  }
}

document.addEventListener('DOMContentLoaded', initLanguage);
