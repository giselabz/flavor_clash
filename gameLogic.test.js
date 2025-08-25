import test from 'node:test';
import assert from 'node:assert/strict';
import { addToPlate, canPlayCard } from './flavor_clash/public/gameLogic.js';

test('addToPlate deducts energy based on cost', () => {
  const state = { plate: [], energy: 5 };
  const card = { id: 'a', cost: 2 };
  const played = addToPlate(state, card);
  assert.equal(played, true);
  assert.equal(state.energy, 3);
  assert.deepEqual(state.plate, [card]);
});

test('cannot play card when energy is insufficient', () => {
  const state = { plate: [], energy: 1 };
  const card = { id: 'b', cost: 2 };
  assert.equal(canPlayCard(state, card), false);
  const played = addToPlate(state, card);
  assert.equal(played, false);
  assert.equal(state.energy, 1);
  assert.deepEqual(state.plate, []);
});
