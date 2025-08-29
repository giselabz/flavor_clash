import assert from 'node:assert';

// Import the scoring functions from the game logic
import { scoreCombination, explainCombination } from '../flavor_clash/public/api/scoring.js';

// Utility card with no properties so synergies/effects don't alter the base score
const blank = { name: 'Blank' };

// Two-card plate should receive the base score of 1
assert.strictEqual(scoreCombination([blank, blank]), 1);

// Three-card plate should receive the base score of 3
assert.strictEqual(scoreCombination([blank, blank, blank]), 3);

// Explanation should expose the base score line
const explanation = explainCombination([blank, blank]);
assert.ok(explanation.includes('Puntuació base') && explanation.includes('+1'));

console.log('scoring tests passed');

