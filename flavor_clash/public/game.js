// /public/game.js
import { supabase } from './supabaseClient.js';
import { requireAuth } from './session.js';
import GameSessionService from './api/GameSessionService.js';
import { scoreCombination } from './scoring.js';

const state = {
  session: null,
  deckId: localStorage.getItem('selectedDeck') || 'classic',
  turn: 1,
  score: 0,
  plate: [],
  hand: [],
  allCards: [],
};

const $ = (s) => document.querySelector(s);

function updateHUD() {
  $('#deckLbl').textContent = state.deckId;
  $('#turnLbl').textContent = state.turn;
  $('#scoreLbl').textContent = state.score;
}

function chipList(values=[]) {
  return (values||[]).join(', ');
}

function renderCard(c) {
  const el = document.createElement('div');
  el.className = 'card';
  const icon = c.icon_url ? `<img src="${c.icon_url}" onerror="this.style.display='none'" style="width:42px;height:42px;object-fit:cover;border-radius:8px;border:1px solid #0001;">` : `<div style="width:42px;height:42px;border-radius:8px;border:1px solid #0001;display:grid;place-items:center;">🍽️</div>`;
  el.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div class="row" style="gap:8px">
        ${icon}
        <div>
          <div style="font-weight:700">${c.name}</div>
          <div class="muted" style="font-size:12px">${c.type}</div>
        </div>
      </div>
      <button class="btn" data-add style="padding:6px 8px">+ plat</button>
    </div>
    <div style="font-size:12px;margin-top:6px">
      <div><b>Sabor:</b> ${chipList(c.flavor)}</div>
      <div><b>Textura:</b> ${chipList(c.texture)}</div>
      <div><b>Categoria:</b> ${chipList(c.category)}</div>
      ${c.effect ? `<div><b>Efecte:</b> ${c.effect}</div>`:''}
      ${c.condition ? `<div><b>Conditió:</b> ${c.condition}</div>`:''}
    </div>
  `;
  el.querySelector('[data-add]').onclick = () => addToPlate(c);
  return el;
}

function renderHand() {
  const handEl = $('#hand'); handEl.innerHTML = '';
  state.hand.forEach(c => handEl.appendChild(renderCard(c)));
}

function renderPlate() {
  const el = $('#plate'); el.innerHTML = '';
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
      state.plate.splice(idx,1);
      renderPlate();
    };
    el.appendChild(pill);
  });
}

function dealHand() {
  // coge 6 aleatorias
  const pool = [...state.allCards];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  state.hand = pool.slice(0, 6);
  renderHand();
}

function addToPlate(card) {
  state.plate.push(card);
  renderPlate();
}

async function servePlate() {
  if (state.plate.length < 2) {
    alert('Afegeix almenys 2 cartes al plat per puntuar.');
    return;
  }
  const delta = scoreCombination(state.plate);
  state.score += delta;
  state.turn += 1;
  state.plate = [];
  updateHUD();
  renderPlate();

  if (state.session) {
    try {
      await GameSessionService.update(state.session.id, {
        score: state.score,
        turns_played: state.turn,
      });
    } catch (e) { console.warn(e); }
  }

  // nueva mano
  dealHand();
}

async function endMatch() {
  if (state.session) {
    try {
      await GameSessionService.update(state.session.id, {
        score: state.score,
        turns_played: state.turn,
        finished: true,
      });
    } catch (e) { console.warn(e); }
  }
  window.location.href = 'mainMenu.html';
}

async function loadCards() {
  const { data, error } = await supabase.from('cards').select('*');
  if (error) throw error;
  state.allCards = data || [];
}

async function init() {
  await requireAuth('login.html');
  updateHUD();

  try {
    await loadCards();
  } catch (e) {
    console.error(e);
    alert('No s\'han pogut carregar les cartes. Revisa la taula public.cards');
  }

  try {
    state.session = await GameSessionService.start(state.deckId);
  } catch (e) {
    console.error(e);
    alert('No s\'ha pogut crear la sessió de joc. Revisa RLS de game_sessions.');
  }

  dealHand();
  renderPlate();

  $('#btnServe').onclick = servePlate;
  $('#btnEnd').onclick = endMatch;
}

init();
