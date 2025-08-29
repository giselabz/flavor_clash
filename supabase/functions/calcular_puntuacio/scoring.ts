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

const arr = (x: any) => Array.isArray(x) ? x : (x ? [x] : []);

function pairScore(a: any, b: any) {
  let s = 0;
  for (const fa of arr(a.flavor)) for (const fb of arr(b.flavor))
    s += (FLAVOR_SYNERGY[fa]?.[fb] ?? 0);
  for (const ta of arr(a.texture)) for (const tb of arr(b.texture))
    s += (TEXTURE_SYNERGY[ta]?.[tb] ?? 0);
  for (const t of arr(a.tags)) s += (TAG_BONUS[t] ?? 0);
  for (const t of arr(b.tags)) s += (TAG_BONUS[t] ?? 0);
  return s;
}

function hardConflict(a: any, b: any) {
  const A = new Set([...arr(a.tags), ...arr(a.category)]);
  const B = new Set([...arr(b.tags), ...arr(b.category)]);
  return HARD_CONFLICTS.some(([x,y]) => (A.has(x) && B.has(y)) || (A.has(y) && B.has(x)));
}

function applyEffects(plate: any[]) {
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

export function scoreCombination(plate: any[]) {
  if (!plate || plate.length < 2) return 0;

  for (let i=0;i<plate.length;i++)
    for (let j=i+1;j<plate.length;j++)
      if (hardConflict(plate[i], plate[j])) return -5;

  let s = 0;
  for (let i=0;i<plate.length;i++)
    for (let j=i+1;j<plate.length;j++)
      s += pairScore(plate[i], plate[j]);

  const categories = new Set(plate.flatMap(c => arr(c.category)));
  s += Math.min(categories.size, 3);

  s += applyEffects(plate);
  return s;
}
