const translations = {
  ca: {
    nav_home: "Inici",
    nav_play: "Jugar",
    nav_shop: "Botiga",
    nav_profile: "Perfil",
    start_game: "Inicia Partida",
    play_now: "Jugar Ara",
    shop_title: "Botiga",
    profile_title: "El Meu Perfil"
  },
  en: {
    nav_home: "Home",
    nav_play: "Play",
    nav_shop: "Shop",
    nav_profile: "Profile",
    start_game: "Start Game",
    play_now: "Play Now",
    shop_title: "Shop",
    profile_title: "My Profile"
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
