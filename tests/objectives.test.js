import { test } from 'node:test';
import assert from 'node:assert/strict';

global.localStorage = { getItem: () => null, setItem: () => {} };
const { state, maybeAddObjective } = await import('../flavor_clash/public/game.js');

// Minimal DOM stubs
function createEl() {
  return {
    innerHTML: '',
    children: [],
    appendChild(child) { this.children.push(child); },
    textContent: '',
    className: '',
    style: {},
    dataset: {},
    addEventListener() {},
  };
}

const elements = {
  '#objectives': createEl(),
  '#deckLbl': createEl(),
  '#turnLbl': createEl(),
  '#scoreLbl': createEl(),
  '#drawLbl': createEl(),
  '#discardLbl': createEl(),
  '#hand': createEl(),
  '#plate': createEl(),
};

global.document = {
  querySelector: (sel) => elements[sel],
  createElement: () => createEl(),
};

global.alert = () => {};

test('no new objective before threshold', () => {
  state.objectives = ['Inicial'];
  state.objectivePool = ['Nova'];
  state.servedPlates = 2;
  maybeAddObjective();
  assert.equal(state.objectives.includes('Nova'), false);
});

test('adds new objective and renders to DOM', () => {
  state.objectives = ['Inicial'];
  state.objectivePool = ['Nova'];
  elements['#objectives'].children = [];
  state.servedPlates = 3;
  maybeAddObjective();
  assert.equal(state.objectives.includes('Nova'), true);
  assert.equal(elements['#objectives'].children.length, 2);
  assert.equal(elements['#objectives'].children[1].textContent, 'Nova');
});
