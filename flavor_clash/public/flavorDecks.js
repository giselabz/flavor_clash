// --- SINERGIA DE SABORS ENTRE INGREDIENTS ---
// Retorna true si hi ha almenys dos ingredients amb el mateix sabor dominant
function hasFlavorSynergy(cardIds) {
  const flavors = {};
  cardIds.forEach(id => {
    const card = CARDS.find(c => c.id === id && c.type === 'ingredient');
    if (card && card.flavor) {
      card.flavor.forEach(f => {
        if (!flavors[f]) flavors[f] = 0;
        flavors[f]++;
      });
    }
  });
  // Sinergia si algun sabor es repeteix almenys 2 cops
  return Object.values(flavors).some(count => count >= 2);
}

// --- COMPATIBILITAT DE BEGUDA AMB PLAT ---
// Retorna true si la beguda comparteix algun sabor amb algun ingredient del plat
function isDrinkCompatible(ingredientIds, drinkId) {
  const drink = CARDS.find(c => c.id === drinkId && c.type === 'beguda');
  if (!drink) return false;
  let compatible = false;
  ingredientIds.forEach(id => {
    const ing = CARDS.find(c => c.id === id && c.type === 'ingredient');
    if (ing && ing.flavor && drink.flavor) {
      if (ing.flavor.some(f => drink.flavor.includes(f))) compatible = true;
    }
  });
  return compatible;
}
// flavorDecks.js
// Definició de baralles i etiquetes d'ingredients per a Flavor Clash

// Llista de baralles
const DECKS = [
  {
    id: 'classic',
    name: 'Clàssic',
    description: 'Combinacions tradicionals i segures que puntuen per familiaritat cultural.',
    allowedTags: ['classic'],
    forbiddenTags: ['healthy', 'umami', 'sensorial', 'spicy-sweet'],
  },
  {
    id: 'spicy-sweet',
    name: 'Picant-dolç',
    description: 'Combinacions explosives de sabors oposats per obtenir grans puntuacions.',
    allowedTags: ['spicy', 'sweet', 'spicy-sweet'],
    forbiddenTags: ['healthy'],
  },
  {
    id: 'healthy',
    name: 'Saludable',
    description: 'Ingredients naturals i poc processats. Es premien combinacions equilibrades i nutritives.',
    allowedTags: ['healthy'],
    forbiddenTags: ['processed', 'unhealthy'],
  },
  {
    id: 'umami',
    name: 'Umami',
    description: 'Ingredients rics en umami i fermentats per aconseguir sinergies profundes.',
    allowedTags: ['umami', 'fermented'],
    forbiddenTags: ['sweet'],
  },
  {
    id: 'sensorial',
    name: 'Sensorial',
    description: 'Guanya punts a través de contrastos visuals, de textura o de temperatura.',
    allowedTags: ['visual', 'texture', 'temperature', 'sensorial'],
    forbiddenTags: [],
  },
];

// Nova estructura unificada de cartes
const CARDS = [
  // INGREDIENTS PRINCIPALS
  { id: 'tomato', name: 'Tomàquet', type: 'ingredient', flavor: ['umami'], texture: ['suau'], category: ['vegetal'], tags: ['healthy', 'classic', 'mediterrani'], icon: 'icons/tomato.png' },
  { id: 'chicken', name: 'Pollastre', type: 'ingredient', flavor: ['umami'], texture: ['fibrós'], category: ['proteïna'], tags: ['classic'], icon: 'icons/chicken.png' },
  { id: 'rice', name: 'Arròs', type: 'ingredient', flavor: [], texture: ['suau'], category: ['hidrats'], tags: ['classic', 'healthy'], icon: 'icons/rice.png' },
  { id: 'chia', name: 'Llavors de chía', type: 'ingredient', flavor: [], texture: ['cruixent'], category: ['hidrats'], tags: ['healthy'], icon: 'icons/chia.png' },
  { id: 'elderflower', name: 'Flor de saüc', type: 'ingredient', flavor: ['dolç'], texture: ['suau'], category: ['vegetal'], tags: ['sensorial'], icon: 'icons/elderflower.png' },
  { id: 'kombu', name: 'Kombu', type: 'ingredient', flavor: ['umami'], texture: ['fibrós'], category: ['vegetal'], tags: ['umami', 'fermented', 'asiàtic'], icon: 'icons/kombu.png' },
  { id: 'vegan-caviar', name: 'Caviar vegà', type: 'ingredient', flavor: [], texture: ['suau'], category: ['vegetal'], tags: ['sensorial'], icon: 'icons/vegan-caviar.png' },
  { id: 'bacon', name: 'Bacon', type: 'ingredient', flavor: ['salat'], texture: ['cruixent'], category: ['greix', 'proteïna'], tags: ['unhealthy', 'classic'], icon: 'icons/bacon.png' },
  { id: 'butter', name: 'Mantega', type: 'ingredient', flavor: [], texture: ['suau'], category: ['greix'], tags: ['unhealthy', 'classic', 'processed'], icon: 'icons/butter.png' },
  { id: 'soda', name: 'Refresc', type: 'beguda', flavor: ['dolç'], texture: ['gasosa'], category: ['alta caloría'], tags: ['unhealthy', 'processed', 'sweet'], icon: 'icons/soda.png' },
  { id: 'fries', name: 'Fregits', type: 'ingredient', flavor: [], texture: ['cruixent'], category: ['hidrats'], tags: ['unhealthy', 'processed'], icon: 'icons/fries.png' },
  // Exemples addicionals
  { id: 'strawberry', name: 'Maduixa', type: 'ingredient', flavor: ['dolç'], texture: ['suau'], category: ['fruita'], tags: ['mediterrani'], icon: 'icons/strawberry.png' },
  { id: 'mango', name: 'Mango', type: 'ingredient', flavor: ['dolç'], texture: ['suau'], category: ['fruita'], tags: ['tropical'], icon: 'icons/mango.png' },
  { id: 'carrot', name: 'Pastanaga', type: 'ingredient', flavor: ['dolç'], texture: ['fibrós'], category: ['vegetal'], tags: [], icon: 'icons/carrot.png' },
  { id: 'olive', name: 'Oliva', type: 'ingredient', flavor: ['salat'], texture: ['suau'], category: ['greix'], tags: ['mediterrani'], icon: 'icons/olive.png' },
  { id: 'anchovy', name: 'Anxova', type: 'ingredient', flavor: ['salat'], texture: ['fibrós'], category: ['proteïna'], tags: ['mediterrani'], icon: 'icons/anchovy.png' },
  { id: 'cheese', name: 'Formatge', type: 'ingredient', flavor: ['salat'], texture: ['suau'], category: ['làctic'], tags: ['classic'], icon: 'icons/cheese.png' },
  { id: 'lemon', name: 'Llimona', type: 'ingredient', flavor: ['àcid'], texture: ['líquid'], category: ['fruita'], tags: [], icon: 'icons/lemon.png' },
  { id: 'yogurt', name: 'Iogurt', type: 'ingredient', flavor: ['àcid'], texture: ['suau'], category: ['làctic'], tags: [], icon: 'icons/yogurt.png' },
  { id: 'vinegar', name: 'Vinagre', type: 'ingredient', flavor: ['àcid'], texture: ['líquid'], category: [], tags: [], icon: 'icons/vinegar.png' },
  { id: 'rucula', name: 'Ruca', type: 'ingredient', flavor: ['amarg'], texture: ['fibrós'], category: ['vegetal'], tags: [], icon: 'icons/rucula.png' },
  { id: 'escarole', name: 'Escarola', type: 'ingredient', flavor: ['amarg'], texture: ['fibrós'], category: ['vegetal'], tags: [], icon: 'icons/escarole.png' },
  { id: 'coffee', name: 'Cafè', type: 'ingredient', flavor: ['amarg'], texture: ['líquid'], category: [], tags: [], icon: 'icons/coffee.png' },
  { id: 'shiitake', name: 'Bolet shiitake', type: 'ingredient', flavor: ['umami'], texture: ['fibrós'], category: ['vegetal'], tags: ['asiàtic'], icon: 'icons/shiitake.png' },
  { id: 'dried-tomato', name: 'Tomàquet sec', type: 'ingredient', flavor: ['umami'], texture: ['fibrós'], category: ['vegetal'], tags: ['mediterrani'], icon: 'icons/dried-tomato.png' },
  { id: 'miso', name: 'Miso', type: 'ingredient', flavor: ['umami'], texture: ['densa'], category: ['proteïna'], tags: ['asiàtic'], icon: 'icons/miso.png' },
  // BEGUDES
  { id: 'fruit-juice', name: 'Suc de fruita', type: 'beguda', flavor: ['dolç'], texture: ['suau'], category: ['sense sucre'], tags: ['tropical'], icon: 'icons/fruit-juice.png' },
  { id: 'honey-liqueur', name: 'Licor de mel', type: 'beguda', flavor: ['dolç'], texture: ['densa'], category: ['alta caloría'], tags: [], icon: 'icons/honey-liqueur.png' },
  { id: 'white-wine', name: 'Vi blanc', type: 'beguda', flavor: ['àcid'], texture: ['suau'], category: ['baixa caloría'], tags: ['mediterrani'], icon: 'icons/white-wine.png' },
  { id: 'kombucha', name: 'Kombucha', type: 'beguda', flavor: ['àcid'], texture: ['suau'], category: ['baixa caloría'], tags: [], icon: 'icons/kombucha.png' },
  { id: 'lemon-juice', name: 'Suc de llimona', type: 'beguda', flavor: ['àcid'], texture: ['suau'], category: ['sense sucre'], tags: [], icon: 'icons/lemon-juice.png' },
  { id: 'ipa-beer', name: 'Cervesa IPA', type: 'beguda', flavor: ['amarg'], texture: ['gasosa'], category: [], tags: [], icon: 'icons/ipa-beer.png' },
  { id: 'black-tea', name: 'Te negre', type: 'beguda', flavor: ['amarg'], texture: ['suau'], category: ['sense sucre'], tags: [], icon: 'icons/black-tea.png' },
  { id: 'cold-coffee', name: 'Cafè fred', type: 'beguda', flavor: ['amarg'], texture: ['líquid'], category: [], tags: [], icon: 'icons/cold-coffee.png' },
  { id: 'sake', name: 'Sake', type: 'beguda', flavor: ['umami'], texture: ['líquid'], category: [], tags: ['asiàtic'], icon: 'icons/sake.png' },
  { id: 'clear-broth', name: 'Brou clar', type: 'beguda', flavor: ['umami'], texture: ['líquid'], category: [], tags: [], icon: 'icons/clear-broth.png' },
  { id: 'water', name: 'Aigua', type: 'beguda', flavor: ['neutre'], texture: ['líquid'], category: ['sense sucre'], tags: [], icon: 'icons/water.png' },
  { id: 'sparkling-water', name: 'Aigua amb gas', type: 'beguda', flavor: ['neutre'], texture: ['gasosa'], category: ['sense sucre'], tags: [], icon: 'icons/sparkling-water.png' },
  { id: 'smoothie', name: 'Batut', type: 'beguda', flavor: ['dolç'], texture: ['densa'], category: ['alta caloría'], tags: ['tropical'], icon: 'icons/smoothie.png' },
  // CONDIMENTS
  { id: 'salt', name: 'Sal', type: 'condiment', flavor: [], texture: [], category: [], tags: [], icon: 'icons/salt.png' },
  { id: 'pepper', name: 'Pebre', type: 'condiment', flavor: [], texture: [], category: [], tags: [], icon: 'icons/pepper.png' },
  { id: 'lime', name: 'Llima', type: 'condiment', flavor: ['àcid'], texture: [], category: [], tags: [], icon: 'icons/lime.png' },
  { id: 'soy-sauce', name: 'Salsa soja', type: 'condiment', flavor: ['umami'], texture: ['líquid'], category: [], tags: ['asiàtic'], icon: 'icons/soy-sauce.png' },
  // ACCIONS
  { id: 'swap', name: 'Intercanvi', type: 'accio', effect: 'canvia una carta de la mà amb una del tauler o de la pila de descart', icon: 'icons/swap.png' },
  { id: 'multiplier', name: 'Multiplicador', type: 'accio', effect: 'dobla el valor d’una combinació', icon: 'icons/multiplier.png' },
  { id: 'super-multiplier', name: 'Super Multiplicador x10', type: 'accio', effect: 'durant 3 minuts, multiplica per 10 els punts de qualsevol combinació vàlida', icon: 'icons/super-multiplier.png' },
  { id: 'reveal', name: 'Revelació', type: 'accio', effect: 'ensenya les 3 properes cartes de la pila', icon: 'icons/reveal.png' },
  { id: 'vital-bonus', name: 'Bonificació Vital', type: 'accio', effect: 'regenera +1 torn si no uses cartes prohibides', icon: 'icons/vital-bonus.png' },
  // OBJECTIUS
  { id: 'veg-no-sugar', name: '100% vegetal i sense sucres afegits', type: 'objectiu', condition: 'Totes les cartes del plat han de ser vegetals i sense sucre', icon: 'icons/veg-no-sugar.png' },
  { id: 'spicy-fruit', name: 'Picant + fruita', type: 'objectiu', condition: 'Combina un ingredient picant amb una fruita', icon: 'icons/spicy-fruit.png' },
  { id: 'three-textures', name: '3 textures diferents', type: 'objectiu', condition: 'Fes servir 3 textures diferents en un mateix plat', icon: 'icons/three-textures.png' },
];

// Lògica de penalització i bonificació (ara per a qualsevol carta de tipus ingredient o beguda)
export function isCardForbidden(deckId, cardId) {
  const deck = DECKS.find(d => d.id === deckId);
  const card = CARDS.find(i => i.id === cardId);
  if (!deck || !card) return false;
  return card.tags && card.tags.some(tag => deck.forbiddenTags.includes(tag));
}

export function isCardBonus(deckId, cardId) {
  const deck = DECKS.find(d => d.id === deckId);
  const card = CARDS.find(i => i.id === cardId);
  if (!deck || !card) return false;
  return card.tags && card.tags.some(tag => deck.allowedTags.includes(tag));
}

// Exportar per ús en altres scripts
window.DECKS = DECKS;
window.CARDS = CARDS;
window.isCardForbidden = isCardForbidden;
window.isCardBonus = isCardBonus;
window.hasFlavorSynergy = hasFlavorSynergy;
window.isDrinkCompatible = isDrinkCompatible;
