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
    profile_upload_btn: "Pujar imatge",
    login_title: "Inicia sessió",
    login_email: "Email",
    login_password: "Contrasenya",
    login_submit: "Entrar",
    login_cancel: "Cancel·lar",
    login_no_account: "No tens compte?",
    login_register: "Registra't",
    register_title: "Crea el teu compte",
    register_intro: "Registra't amb email i contrasenya i tria un avatar.",
    register_name: "Nom",
    register_email: "Email *",
    register_password: "Contrasenya *",
    register_avatar: "Tria un avatar",
    register_submit: "Crear compte",
    register_cancel: "Cancel·lar",
    register_have_account: "Ja tens compte?",
    register_login: "Inicia sessió",
    rules_title: "Com es juga",
    rules_point1: "Arrossega ingredients al plat i serveix-los.",
    rules_point2: "Completa objectius per punts extra.",
    rules_point3: "La partida acaba quan s'acaba la baralla, serveixes 5 plats o s'esgota el temps.",
    rules_start: "Entesos!"
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
    profile_upload_btn: "Upload image",
    login_title: "Sign In",
    login_email: "Email",
    login_password: "Password",
    login_submit: "Sign In",
    login_cancel: "Cancel",
    login_no_account: "No account?",
    login_register: "Register",
    register_title: "Create your account",
    register_intro: "Sign up with email and password and choose an avatar.",
    register_name: "Name",
    register_email: "Email *",
    register_password: "Password *",
    register_avatar: "Choose an avatar",
    register_submit: "Create account",
    register_cancel: "Cancel",
    register_have_account: "Already have an account?",
    register_login: "Sign In",
    rules_title: "How to play",
    rules_point1: "Drag ingredients to your plate and serve them.",
    rules_point2: "Complete objectives for bonus points.",
    rules_point3: "Game ends when the deck is empty, you serve 5 plates, or time runs out.",
    rules_start: "Got it!"
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
