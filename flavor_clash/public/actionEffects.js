// /public/actionEffects.js
// Effect handlers for action cards

export function swapHands(state, { dealHand }) {
  state.discardPile.push(...state.hand);
  state.hand = [];
  dealHand();
}

export function superMultiplier(state) {
  state.multiplier = 10;
  state.multiplierTurns = 3;
}
