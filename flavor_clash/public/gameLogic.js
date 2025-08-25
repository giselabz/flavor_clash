export function canPlayCard(state, card) {
  const cost = card?.cost ?? 0;
  return state.plate.length < 5 && state.energy >= cost;
}

export function addToPlate(state, card) {
  if (!canPlayCard(state, card)) {
    return false;
  }
  state.energy -= card.cost ?? 0;
  state.plate.push(card);
  return true;
}
