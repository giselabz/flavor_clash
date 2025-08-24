// /public/game.js
import { supabase } from './supabaseClient.js';
import { requireAuth } from './session.js';
import GameSessionService from './api/GameSessionService.js';
import { scoreCombination, explainCombination } from './api/scoring.js';
import './flavorDecks.js';

const state = {
  session: null,
  deckId: localStorage.getItem('selectedDeck') || 'classic',
  turn: 1,
  score: 0,
  plate: [],
  hand: [],
  drawPile: [],
  discardPile: [],
  objectives: ['Arriba 20 punts', 'Serveix un plat picant'],
  allCards: [],
  energy: 3,
  maxEnergy: 3,
  actionUsed: false,
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
  const energyLbl = $('#energyLbl');
  if (energyLbl) energyLbl.textContent = state.energy;
}

function chipList(values = []) {
  return (values || []).join(', ');
}

function renderCard(c) {
  const el = document.createElement('div');
  el.className = 'card';
  el.draggable = true;
  el.dataset.id = c.id;
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', c.id);
  });
  el.onclick = () => addToPlateFromHand(c.id);
  el.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    discardFromHand(c.id);
  });
  const icon = c.icon_url
    ? `<img src="${c.icon_url}" onerror="this.style.display='none'" style="width:42px;height:42px;object-fit:cover;border-radius:8px;border:1px solid #0001;">`
    : `<div style="width:42px;height:42px;border-radius:8px;border:1px solid #0001;display:grid;place-items:center;">🍽️</div>`;
  el.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div class="row" style="gap:8px">
        ${icon}
        <div>
          <div style="font-weight:700">${c.name}</div>
          <div class="muted" style="font-size:12px">${c.type}</div>
        </div>
      </div>
    </div>
    <div style="font-size:12px;margin-top:6px">
      <div><b>Sabor:</b> ${chipList(c.flavor)}</div>
      <div><b>Textura:</b> ${chipList(c.texture)}</div>
      <div><b>Categoria:</b> ${chipList(c.category)}</div>
      ${c.effect ? `<div><b>Efecte:</b> ${c.effect}</div>` : ''}
      ${c.condition ? `<div><b>Conditió:</b> ${c.condition}</div>` : ''}
    </div>
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
    el.innerHTML = '<span class="muted">Cap carta al plat.</span>';
    return;
  }
  state.plate.forEach((c, idx) => {
    const pill = document.createElement('button');
    pill.className = 'btn';
    pill.style.padding = '6px 10px';
    pill.textContent = c.name + ' ✕';
    pill.title = 'Treure del plat';
    pill.onclick = () => {
      state.plate.splice(idx, 1);
      renderPlate();
    };
    el.appendChild(pill);
  });
}

function renderObjectives() {
  const el = $('#objectives');
  el.innerHTML = '';
  state.objectives.forEach((o) => {
    const li = document.createElement('li');
    li.textContent = o;
    el.appendChild(li);
  });
}

function canPlayCard(card) {
  if (card.type === 'accio') {
    return !state.actionUsed;
  }
  if (card.type === 'beguda') {
    return state.plate.some((c) => c.type === 'ingredient');
  }
  return state.plate.length < 5 && state.energy > 0;
}

function addToPlate(card) {
  if (card.type !== 'beguda') {
    state.energy -= 1;
  }
  state.plate.push(card);
  renderPlate();
  updateHUD();
}

function playActionCard(idx) {
  if (state.actionUsed) {
    alert('Ja has jugat una carta d\'acció aquest torn.');
    return;
  }
  const card = state.hand[idx];
  state.hand.splice(idx, 1);
  state.discardPile.push(card);
  state.actionUsed = true;
  alert(card.effect || 'Efecte aplicat');
  renderHand();
  updateHUD();
}

function addToPlateFromHand(id) {
  const idx = state.hand.findIndex((c) => c.id == id);
  if (idx === -1) return;
  const card = state.hand[idx];
  if (card.type === 'accio') {
    playActionCard(idx);
    return;
  }
  if (!canPlayCard(card)) {
    alert('La carta no es pot jugar en aquest moment.');
    return;
  }
  if (card.type === 'beguda') {
    const ingredientIds = state.plate.filter((c) => c.type === 'ingredient').map((c) => c.id);
    if (!window.isDrinkCompatible || !window.isDrinkCompatible(ingredientIds, card.id)) {
      alert('La beguda no és compatible amb el plat.');
      return;
    }
  }
  state.hand.splice(idx, 1);
  addToPlate(card);
  renderHand();
}

function discardFromHand(id) {
  const idx = state.hand.findIndex((c) => c.id == id);
  if (idx === -1) return;
  const card = state.hand[idx];
  if (card.protected) {
    alert('Aquesta carta està protegida i no es pot descartar.');
    return;
  }
  state.hand.splice(idx, 1);
  state.discardPile.push(card);
  if (window.isCardForbidden && window.isCardForbidden(state.deckId, card.id)) {
    state.score += 1;
  }
  renderHand();
  updateHUD();
}

function handleDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  addToPlateFromHand(id);
}

function drawPhase() {
  while (state.hand.length < 5) {
    if (!state.drawPile.length) {
      state.drawPile = shuffle([...state.discardPile]);
      state.discardPile = [];
    }
    if (!state.drawPile.length) break;
    state.hand.push(state.drawPile.shift());
  }
  renderHand();
  updateHUD();
}

function startTurn() {
  state.energy = state.maxEnergy;
  state.actionUsed = false;
  drawPhase();
  renderPlate();
}

function verifyObjectives(servedPlate) {
  const remaining = [];
  state.objectives.forEach((o) => {
    if (o === 'Arriba 20 punts') {
      if (state.score < 20) remaining.push(o);
    } else if (o === 'Serveix un plat picant') {
      const spicy = servedPlate.some((c) => c.flavor && c.flavor.includes('spicy'));
      if (!spicy) remaining.push(o);
    } else {
      remaining.push(o);
    }
  });
  state.objectives = remaining;
  renderObjectives();
}

async function servePlate() {
  if (state.plate.length < 2) {
    alert('Afegeix almenys 2 cartes al plat per puntuar.');
    return;
  }
  const servedPlate = [...state.plate];
  const delta = scoreCombination(servedPlate);
  const info = explainCombination(servedPlate);
  state.score += delta;
  verifyObjectives(servedPlate);
  state.turn += 1;
  state.discardPile.push(...servedPlate, ...state.hand);
  state.plate = [];
  state.hand = [];
  updateHUD();
  renderPlate();
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

  startTurn();
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
  startTurn();

  const plateEl = $('#plate');
  plateEl.addEventListener('dragover', (e) => e.preventDefault());
  plateEl.addEventListener('drop', handleDrop);

  $('#btnServe').onclick = servePlate;
  $('#btnEnd').onclick = endMatch;
}

init();
