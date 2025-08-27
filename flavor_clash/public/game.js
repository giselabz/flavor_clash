// /public/game.js
import { supabase } from './supabaseClient.js';
import { requireAuth } from './session.js';
import GameSessionService from './api/GameSessionService.js';
import { scoreCombination, explainCombination } from './api/scoring.js';

const state = {
  session: null,
  deckId: localStorage.getItem('selectedDeck') || 'classic',
  turn: 1,
  score: 0,
  plate: [],
  hand: [],
  drawPile: [],
  discardPile: [],
  objectives: [
    { text: 'Crea un plat amb 3 ingredients diferents', points: 15, completed: false },
    { text: 'Combina un ingredient dolç amb un àcid', points: 20, completed: false },
    { text: 'Crea un plat sense ingredients processats', points: 25, completed: false },
  ],
  allCards: [],
  bestServe: 0,
};

const $ = (s) => document.querySelector(s);

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateHUD() {
  $('#deckLbl').textContent = state.deckId;
  $('#turnLbl').textContent = state.turn;
  $('#scoreLbl').textContent = state.score;
  $('#drawLbl').textContent = state.drawPile.length;
  $('#discardLbl').textContent = state.discardPile.length;
}

function chipList(values = []) {
  return (values || []).join(', ');
}

function badgeRow(label, values = [], colorClasses = '') {
  if (!values || !values.length) return '';
  const badges = values
    .map((v) => `<span class="px-2 py-0.5 rounded-full ${colorClasses}">${v}</span>`)
    .join(' ');
  return `<div class="flex items-start gap-1"><span class="font-semibold">${label}:</span><div class="flex flex-wrap gap-1">${badges}</div></div>`;
}

function getTheme(card) {
  const tags = card.tags || [];
  if (tags.includes('spicy') || tags.includes('spicy-sweet')) return 'theme-spicy';
  if (tags.includes('healthy')) return 'theme-healthy';
  if (tags.includes('umami') || tags.includes('fermented')) return 'theme-umami';
  if (tags.includes('sensorial')) return 'theme-sensorial';
  return 'theme-classic';
}

function renderCard(c) {
  const el = document.createElement('article');
  el.className = `card ${getTheme(c)} cursor-grab`;
  el.draggable = true;
  el.dataset.id = c.id;
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', c.id);
  });
  el.onclick = () => addToPlateFromHand(c.id);
  const icon = c.icon_url
    ? `<img src="${c.icon_url}" onerror="this.style.display='none'" alt="${c.name}">`
    : '<span>🍽️</span>';
  const tagsHtml = [...(c.flavor || []), ...(c.texture || [])]
    .map((t) => `<span class="tag">${t}</span>`)
    .join('');
  el.innerHTML = `
    <div class="rays"></div>
    <div class="frame"></div>
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
    <div class="edge"></div>
    <div class="hero"><div class="hero-ring">${icon}</div></div>
    <h2 class="title">${c.name}</h2>
    <div class="tags">${tagsHtml}</div>
    <div class="foot"><div class="rows"><div class="row">
      <span class="pill">Sabor: ${chipList(c.flavor)}</span>
      <span class="pill">Categoria: ${chipList(c.category)}</span>
    </div></div></div>
  `;
  return el;
}

function renderHand() {
  const handEl = $('#hand');
  handEl.innerHTML = '';
  state.hand.forEach((c) => handEl.appendChild(renderCard(c)));
}

function renderPlate() {
  const el = $('#plate');
  el.innerHTML = '';
  if (!state.plate.length) {
    el.innerHTML = '<span class="text-sm text-gray-500">Cap carta al plat.</span>';
    return;
  }
  state.plate.forEach((c, idx) => {
    const pill = document.createElement('button');
    pill.className = 'px-3 py-1 rounded-lg border bg-white text-sm hover:bg-gray-50';
    pill.textContent = c.name + ' ✕';
    pill.title = 'Treure del plat';
    pill.onclick = () => {
      state.hand.push(state.plate.splice(idx, 1)[0]);
      renderPlate();
      renderHand();
    };
    el.appendChild(pill);
  });
}

function renderObjectives() {
  const grid = $('#objectivesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  state.objectives.forEach((o) => {
    const wrap = document.createElement('div');
    const done = o.completed;
    wrap.className = `flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${done ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`;
    const icon = `<div class="obj-circle ${done ? 'done' : ''}"></div>`;
    wrap.innerHTML = `${icon}<div class="flex-1"><p class="text-sm font-medium text-gray-700">${o.text}</p><p class="text-xs text-gray-500 mt-1">+${o.points} punts</p></div>`;
    grid.appendChild(wrap);
  });
}

function checkObjectives(served) {
  if (!served || !served.length) return;

  // Objective 1: at least 3 different ingredients
  if (!state.objectives[0].completed) {
    const unique = new Set(served.map((c) => c.id || c.name));
    if (unique.size >= 3) state.objectives[0].completed = true;
  }

  // Objective 2: sweet + sour combo
  if (!state.objectives[1].completed) {
    const flavors = served.flatMap((c) => (c.flavor || []).map((f) => f.toLowerCase()));
    const hasSweet = flavors.some((f) => f.includes('dolç') || f.includes('sweet'));
    const hasSour = flavors.some((f) => f.includes('àcid') || f.includes('acid') || f.includes('sour'));
    if (hasSweet && hasSour) state.objectives[1].completed = true;
  }

  // Objective 3: no processed ingredients
  if (!state.objectives[2].completed) {
    const hasProcessed = served.some((c) => (c.tags || []).some((t) => t.toLowerCase().includes('processat') || t.toLowerCase().includes('processed')));
    if (!hasProcessed) state.objectives[2].completed = true;
  }

  renderObjectives();
}

function canPlayCard(card) {
  return state.plate.length < 5;
}

function addToPlate(card) {
  state.plate.push(card);
  renderPlate();
}

function addToPlateFromHand(id) {
  const idx = state.hand.findIndex((c) => c.id == id);
  if (idx === -1) return;
  const card = state.hand[idx];
  if (!canPlayCard(card)) {
    alert('La carta no es pot jugar en aquest moment.');
    return;
  }
  state.hand.splice(idx, 1);
  addToPlate(card);
  renderHand();
}

function handleDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  addToPlateFromHand(id);
}

function refillHand() {
  while (state.hand.length < 6) {
    if (!state.drawPile.length) {
      if (!state.discardPile.length) break;
      state.drawPile = shuffle([...state.discardPile]);
      state.discardPile = [];
    }
    state.hand.push(state.drawPile.shift());
  }
  renderHand();
  updateHUD();
}

function dealHand() {
  state.hand = [];
  refillHand();
}

function playServeAnimation(cards, delta, isHigh) {
  return new Promise((resolve) => {
    const plateEl = $('#plate');
    if (!plateEl) return resolve();
    const rect = plateEl.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'serve-anim-layer';
    layer.style.position = 'fixed';
    layer.style.left = rect.left + 'px';
    layer.style.top = rect.top + 'px';
    layer.style.width = rect.width + 'px';
    layer.style.height = rect.height + 'px';
    document.body.appendChild(layer);
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    [...plateEl.children].forEach((pill) => {
      const pRect = pill.getBoundingClientRect();
      const clone = pill.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = pRect.left - rect.left + 'px';
      clone.style.top = pRect.top - rect.top + 'px';
      clone.style.transition = 'all 0.5s ease';
      layer.appendChild(clone);
      requestAnimationFrame(() => {
        const dx = cx - (pRect.left - rect.left) - pRect.width / 2;
        const dy = cy - (pRect.top - rect.top) - pRect.height / 2;
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
        clone.style.opacity = '0';
      });
    });

    setTimeout(() => {
      const bubble = document.createElement('div');
      bubble.textContent = (delta >= 0 ? '+' : '') + delta;
      bubble.className = 'score-bubble ' + (isHigh ? 'score-bubble-high' : 'score-bubble-low');
      bubble.style.left = cx + 'px';
      bubble.style.top = cy + 'px';
      layer.appendChild(bubble);

      const sparkCount = isHigh ? 12 : 8;
      for (let i = 0; i < sparkCount; i++) {
        const s = document.createElement('div');
        s.className = 'spark ' + (isHigh ? 'spark-high' : 'spark-low');
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 40;
        s.style.left = cx + 'px';
        s.style.top = cy + 'px';
        s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        layer.appendChild(s);
      }
      for (let i = 0; i < 3; i++) {
        const m = document.createElement('div');
        m.className = 'smoke';
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 20;
        m.style.left = cx + 'px';
        m.style.top = cy + 'px';
        m.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
        m.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
        layer.appendChild(m);
      }

      setTimeout(() => {
        document.body.removeChild(layer);
        resolve();
      }, 1000);
    }, 500);
  });
}

async function servePlate() {
  if (state.plate.length < 2) {
    alert('Afegeix almenys 2 cartes al plat per puntuar.');
    return;
  }
  const served = [...state.plate];
  const delta = scoreCombination(served);
  const info = explainCombination(served);
  await playServeAnimation(served, delta, delta > state.bestServe);
  state.score += delta;
  if (delta > state.bestServe) state.bestServe = delta;
  state.turn += 1;
  state.discardPile.push(...served);
  state.plate = [];
  renderPlate();
  checkObjectives(served);
  if (info) {
    alert(info);
  } else {
    alert('No es pot mostrar informació per aquesta combinació.');
  }

  if (state.session) {
    try {
      await GameSessionService.update(state.session.id, {
        score: state.score,
        turns_played: state.turn,
      });
    } catch (e) {
      console.warn(e);
    }
  }

  refillHand();
}

async function endMatch() {
  if (state.session) {
    try {
      await GameSessionService.update(state.session.id, {
        score: state.score,
        turns_played: state.turn,
        finished: true,
      });
    } catch (e) {
      console.warn(e);
    }
  }
  window.location.href = 'mainMenu.html';
}

async function loadCards() {
  const { data, error } = await supabase.from('cards').select('*');
  if (error) throw error;
  state.allCards = data || [];
  state.drawPile = shuffle([...state.allCards]);
}

async function init() {
  await requireAuth('login.html');
  updateHUD();

  try {
    await loadCards();
  } catch (e) {
    console.error(e);
    alert("No s'han pogut carregar les cartes. Revisa la taula public.cards");
  }

  try {
    state.session = await GameSessionService.start(state.deckId);
  } catch (e) {
    console.error(e);
    alert("No s'ha pogut crear la sessió de joc. Revisa RLS de game_sessions.");
  }

  renderObjectives();
  dealHand();
  renderPlate();

  const plateEl = $('#plate');
  plateEl.addEventListener('dragover', (e) => e.preventDefault());
  plateEl.addEventListener('drop', handleDrop);

  $('#btnServe').onclick = servePlate;
  $('#btnEnd').onclick = endMatch;
}

init();
