// /public/scoring.js
// Motor de puntuación básico (sinergias + penalizaciones + efectos simples)

const FLAVOR_SYNERGY = {
  sweet:  { sweet:0, salty:2, sour:1,  bitter:0, spicy:1, umami:1 },
  salty:  { sweet:2, salty:0, sour:0,  bitter:0, spicy:1, umami:2 },
  sour:   { sweet:1, salty:0, sour:0,  bitter:-1,spicy:1, umami:0 },
  bitter: { sweet:0, salty:0, sour:-1, bitter:0, spicy:0, umami:1 },
  spicy:  { sweet:1, salty:1, sour:1,  bitter:0, umami:1 },
  umami:  { sweet:1, salty:2, sour:0,  bitter:1, spicy:1, umami:0 },
};

const TEXTURE_SYNERGY = {
  crunchy:{ creamy:2, soft:1,  liquid:0, crunchy:0 },
  creamy: { crunchy:2, soft:0, liquid:1, creamy:0 },
  soft:   { crunchy:1, creamy:0, liquid:0, soft:0 },
  liquid: { crunchy:0, creamy:1, soft:0, liquid:0 },
};

const TAG_BONUS = { fresh:1, grilled:1, fermented:2, citrus:1 };

const HARD_CONFLICTS = [
  ['dairy','acid'],
  ['raw_fish','cheese'],
];

const arr = (x) => Array.isArray(x) ? x : (x ? [x] : []);
const has = (card, key, val) => new Set(arr(card[key])).has(val);

function pairScore(a, b) {
  let s = 0;
  for (const fa of arr(a.flavor)) for (const fb of arr(b.flavor))
    s += (FLAVOR_SYNERGY[fa]?.[fb] ?? 0);
  for (const ta of arr(a.texture)) for (const tb of arr(b.texture))
    s += (TEXTURE_SYNERGY[ta]?.[tb] ?? 0);
  for (const t of arr(a.tags)) s += (TAG_BONUS[t] ?? 0);
  for (const t of arr(b.tags)) s += (TAG_BONUS[t] ?? 0);
  return s;
}

function hardConflict(a, b) {
  const A = new Set([...arr(a.tags), ...arr(a.category)]);
  const B = new Set([...arr(b.tags), ...arr(b.category)]);
  return HARD_CONFLICTS.some(([x,y]) => (A.has(x) && B.has(y)) || (A.has(y) && B.has(x)));
}
function explainCombination(plate) {
  if (!plate || plate.length < 2) return null;
}
function applyEffects(plate) {
  let bonus = 0;
  for (const c of plate) {
    const e = (c.effect || '').toLowerCase();
    if (!e) continue;
    if (e.includes('fruta') || e.includes('fruit')) {
      const ok = plate.some(p => arr(p.category).includes('fruit'));
      if (ok) bonus += 3;
    }
    if (e.includes('cítric') || e.includes('citrus')) {
      const ok = plate.some(p => arr(p.tags).includes('citrus'));
      if (ok) bonus += 2;
    }
    if (e.includes('lácte') || e.includes('dairy')) {
      const dairy = plate.some(p => arr(p.tags).includes('dairy') || arr(p.category).includes('dairy'));
      const acid  = plate.some(p => arr(p.tags).includes('acid'));
      if (dairy && acid) bonus -= 2;
    }
  }
  return bonus;
}

function scoreCombination(plate) {
  if (!plate || plate.length < 2) return 0;
}
const FLAVOR_COMPATIBILITY = {
  sweet: { sweet: 0, salty: 2, sour: 1, bitter: 0, spicy: 1, umami: 1 },
  salty: { sweet: 2, salty: 0, sour: 0, bitter: 0, spicy: 1, umami: 2 },
  sour: { sweet: 1, salty: 0, sour: 0, bitter: -1, spicy: 1, umami: 0 },
  bitter: { sweet: 0, salty: 0, sour: -1, bitter: 0, spicy: 0, umami: 1 },
  spicy: { sweet: 1, salty: 1, sour: 1, bitter: 0, umami: 1 },
  umami: { sweet: 1, salty: 2, sour: 0, bitter: 1, spicy: 1, umami: 0 },
};

const TEXTURE_COMPATIBILITY = {
  crunchy: { creamy: 2, soft: 1, liquid: 0, crunchy: 0 },
  creamy: { crunchy: 2, soft: 0, liquid: 1, creamy: 0 },
  soft: { crunchy: 1, creamy: 0, liquid: 0, soft: 0 },
  liquid: { crunchy: 0, creamy: 1, soft: 0, liquid: 0 },
};

const TAG_BONUS_POINTS = { fresh: 1, grilled: 1, fermented: 2, citrus: 1 };

const MUTUALLY_EXCLUSIVE_TAGS = [
  ['dairy', 'acid'],
  ['raw_fish', 'cheese'],
];

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value) return [value];
  return [];
}

function calculatePairScore(cardA, cardB) {
  let total = 0;
  for (const flavorA of toArray(cardA.flavor)) {
    for (const flavorB of toArray(cardB.flavor)) {
      total += FLAVOR_COMPATIBILITY[flavorA]?.[flavorB] ?? 0;
    }
  }
  for (const textureA of toArray(cardA.texture)) {
    for (const textureB of toArray(cardB.texture)) {
      total += TEXTURE_COMPATIBILITY[textureA]?.[textureB] ?? 0;
    }
  }
  for (const tag of toArray(cardA.tags)) total += TAG_BONUS_POINTS[tag] ?? 0;
  for (const tag of toArray(cardB.tags)) total += TAG_BONUS_POINTS[tag] ?? 0;
  return total;
}

function hasConflict(cardA, cardB) {
  const tagsA = new Set([...toArray(cardA.tags), ...toArray(cardA.category)]);
  const tagsB = new Set([...toArray(cardB.tags), ...toArray(cardB.category)]);
  return MUTUALLY_EXCLUSIVE_TAGS.some(
    ([x, y]) => (tagsA.has(x) && tagsB.has(y)) || (tagsA.has(y) && tagsB.has(x))
  );
}

function applyCardEffects(plate) {
  let bonus = 0;
  for (const card of plate) {
    const effect = (card.effect || '').toLowerCase();
    if (!effect) continue;
    if (effect.includes('fruta') || effect.includes('fruit')) {
      const hasFruit = plate.some((c) => toArray(c.category).includes('fruit'));
      if (hasFruit) bonus += 3;
    }
    if (effect.includes('cítric') || effect.includes('citrus')) {
      const hasCitrus = plate.some((c) => toArray(c.tags).includes('citrus'));
      if (hasCitrus) bonus += 2;
    }
    if (effect.includes('lácte') || effect.includes('dairy')) {
      const hasDairy = plate.some(
        (c) => toArray(c.tags).includes('dairy') || toArray(c.category).includes('dairy')
      );
      const hasAcid = plate.some((c) => toArray(c.tags).includes('acid'));
      if (hasDairy && hasAcid) bonus -= 2;
    }
  }
  return bonus;
}

export function calculatePlateScore(plate) {
  if (!plate || plate.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < plate.length; i++) {
    for (let j = i + 1; j < plate.length; j++) {
      const pairScore = calculatePairScore(plate[i], plate[j]);
      if (hasConflict(plate[i], plate[j])) {
        total -= Math.abs(pairScore);
      } else {
        total += pairScore;
      }
    }
  }

  const categories = new Set(plate.flatMap((c) => toArray(c.category)));
  total += Math.min(categories.size, 3);

  total += applyCardEffects(plate);
  return total;
}

export function explainPlateScore(plate) {
  if (!plate || plate.length < 2) return null;

  const lines = [];
  for (let i = 0; i < plate.length; i++) {
    for (let j = i + 1; j < plate.length; j++) {
      const pairScore = calculatePairScore(plate[i], plate[j]);
      if (hasConflict(plate[i], plate[j])) {
        lines.push(
          `${plate[i].name} i ${plate[j].name} tenen un conflicte (-${Math.abs(pairScore)})`
        );
      } else if (pairScore > 0) {
        lines.push(`${plate[i].name} i ${plate[j].name} combinen bé (+${pairScore})`);
      } else if (pairScore < 0) {
        lines.push(`${plate[i].name} i ${plate[j].name} no combinen (${pairScore})`);
      }
    }
  }

  const effectsBonus = applyCardEffects(plate);
  if (effectsBonus > 0) lines.push(`Bonificació d'efectes: +${effectsBonus}`);
  if (effectsBonus < 0) lines.push(`Penalització d'efectes: ${effectsBonus}`);

  return lines.length ? lines.join('\n') : null;
}

export { scoreCombination, explainCombination };
