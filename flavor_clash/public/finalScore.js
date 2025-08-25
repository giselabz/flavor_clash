import { requireAuth } from './session.js';
import UserService from './api/UserService.js';

const $ = (s) => document.querySelector(s);

function rankFromScore(score){
  if(score >= 30) return 'S';
  if(score >= 20) return 'A';
  if(score >= 10) return 'B';
  return 'C';
}

async function init(){
  await requireAuth('login.html');

  const score = parseInt(localStorage.getItem('lastMatchScore') || '0', 10);
  const turns = parseInt(localStorage.getItem('lastMatchTurns') || '0', 10);
  const objectives = JSON.parse(localStorage.getItem('lastMatchObjectives') || '[]');

  $('#finalScore').textContent = score;
  $('#turnsPlayed').textContent = turns;
  $('#rank').textContent = rankFromScore(score);

  const objBlock = $('#objectivesBlock');
  if(objectives.length){
    const list = document.createElement('ul');
    objectives.forEach(o => {
      const li = document.createElement('li');
      li.textContent = `${o.name} (+${o.points})`;
      list.appendChild(li);
    });
    objBlock.innerHTML = '<h3>Objectius assolits</h3>';
    objBlock.appendChild(list);
  } else {
    objBlock.textContent = 'No s\'ha assolit cap objectiu.';
  }

  const pending = parseInt(localStorage.getItem('pendingScore') || '0', 10);
  if(pending){
    try{
      const profile = await UserService.getMyProfile();
      const current = profile?.flavor_points || 0;
      await UserService.updateMyProfile({ flavor_points: current + pending });
      localStorage.removeItem('pendingScore');
    }catch(e){
      console.warn(e);
    }
  }

  $('#btnMenu').onclick = () => {
    window.location.href = 'mainMenu.html';
  };
}

init();
