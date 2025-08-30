// --- Generar mà inicial de cartes ---
function renderInitialHand(numCards = 5) {
    if (!window.CARDS) return;
    const hand = document.getElementById('hand');
    if (!hand) return;
    hand.innerHTML = '';
    // Selecciona aleatòriament NOMÉS cartes d'ingredient o beguda
    const candidates = window.CARDS.filter(c => c.type === 'ingredient' || c.type === 'beguda');
    const selected = [];
    while (selected.length < numCards && candidates.length > 0) {
        const idx = Math.floor(Math.random() * candidates.length);
        selected.push(candidates[idx]);
        candidates.splice(idx, 1);
    }
    const placeholder = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'; // Public placeholder image
    selected.forEach(card => {
        const div = document.createElement('div');
        div.className = 'card';
        div.setAttribute('draggable', 'true');
        div.style.minWidth = '90px';
        div.style.minHeight = '120px';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.dataset.ingredientId = card.id;
        // Imatge
        const img = document.createElement('img');
        img.src = card.icon || placeholder;
        img.alt = card.name;
        img.style.width = '48px';
        img.style.height = '48px';
        img.style.marginBottom = '8px';
        img.onerror = function() { this.onerror = null; this.src = placeholder; };
        div.appendChild(img);
        // Nom
        const spanName = document.createElement('span');
        spanName.style.fontWeight = 'bold';
        spanName.textContent = card.name;
        div.appendChild(spanName);
        // Categoria/Tipus
        if (card.category && card.category.length > 0) {
            const spanCat = document.createElement('span');
            spanCat.style.color = '#b85c00b0';
            spanCat.style.fontSize = '0.95em';
            spanCat.textContent = card.category[0];
            div.appendChild(spanCat);
        }
        hand.appendChild(div);
    });
    // Mostra o oculta el missatge de mà buida
    const emptyMsg = document.getElementById('emptyHandMsg');
    if (emptyMsg) emptyMsg.style.display = (selected.length === 0) ? '' : 'none';
}
// --- Main JS para Flavor Clash ---

// --- Estado global (solo en game.html) ---
if (window.location.pathname.endsWith('game.html')) {
    var selectedDeck = null;
    var playedThisTurn = [];
    var drinkAdded = null;
    var actionPlayed = false;
    var healthyFreeDiscardUsed = false;
}

// --- Referencias globales a elementos de formulario ---
let loginForm, registerForm, mainMenu;

// --- Helpers DOM ---
function hideAllSections() {
    if (typeof mainMenu !== 'undefined' && mainMenu) mainMenu.style.display = 'none';
    if (document.getElementById('gameSection')) document.getElementById('gameSection').style.display = 'none';
    if (document.getElementById('settingsSection')) document.getElementById('settingsSection').style.display = 'none';
    if (document.getElementById('shopSection')) document.getElementById('shopSection').style.display = 'none';
    if (document.getElementById('inventorySection')) document.getElementById('inventorySection').style.display = 'none';
    if (document.getElementById('minigamesSection')) document.getElementById('minigamesSection').style.display = 'none';
}

function showMenuError(msg) {
    if (document.getElementById('menuError')) document.getElementById('menuError').textContent = msg;
}

function clearMenuError() {
    if (document.getElementById('menuError')) document.getElementById('menuError').textContent = '';
}

// --- Mostrar formularios ---
function showLogin() {
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    mainMenu.style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

function showRegister() {
    loginForm.style.display = 'none';
    registerForm.style.display = '';
    mainMenu.style.display = 'none';
    document.getElementById('registerError').textContent = '';
}

function showMainMenu(user) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    mainMenu.style.display = '';
    document.getElementById('profileName').textContent = user.name;
    const avatar = document.getElementById('profileAvatar');
    if (user.avatar) {
        avatar.src = user.avatar;
        avatar.style.display = '';
    } else {
        avatar.style.display = 'none';
    }
    document.getElementById('progressInfo').textContent = user.progress ? `Progrés: ${user.progress}` : '';
}

// --- Inicialización al cargar ---
window.onload = function () {
    if (window.location.pathname.endsWith('game.html')) {
        renderInitialHand();
        initializeDragAndDrop();
        if (typeof renderGameBoard === 'function') renderGameBoard();
    }

    if (window.location.pathname.endsWith('mainMenu.html')) {
        let mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            let user = { name: 'Demo', email: 'demo@demo.com', avatar: '', progress: '' };
            mainMenu.style.display = '';
            if (typeof showMainMenu === 'function') showMainMenu(user);
        }
    }

    if (typeof setupLoginRegisterListeners === 'function') {
        setupLoginRegisterListeners();
    }
};

// --- Función para habilitar arrastrar, soltar y reorganizar cartas ---
function initializeDragAndDrop() {
    const hand = document.getElementById('hand');
    const playArea = document.getElementById('playArea');
    if (!hand || !playArea) return;

    let idCounter = 1;
    let draggedCard = null;

    function makeCardDraggable(card) {
        if (!card.id) card.id = 'card-' + (idCounter++);
        card.setAttribute('draggable', 'true');
        card.style.cursor = 'grab';

        card.ondragstart = function (e) {
            draggedCard = card;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.id);
            setTimeout(() => card.style.opacity = '0.4', 0);
        };

        card.ondragend = function () {
            draggedCard = null;
            card.style.opacity = '';
        };

        card.ondragover = function (e) {
            e.preventDefault();
        };

        card.ondrop = function (e) {
            e.preventDefault();
            if (!draggedCard || draggedCard === card) return;

            const parent = card.parentNode;
            const draggedIndex = Array.from(parent.children).indexOf(draggedCard);
            const targetIndex = Array.from(parent.children).indexOf(card);

            if (draggedIndex < targetIndex) {
                parent.insertBefore(draggedCard, card.nextSibling);
            } else {
                parent.insertBefore(draggedCard, card);
            }
        };
    }

    // Hacer cartas existentes arrastrables
    hand.querySelectorAll('.card').forEach(makeCardDraggable);
    playArea.querySelectorAll('.card').forEach(makeCardDraggable);


    function enableDropArea(area) {
        area.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        area.addEventListener('drop', function (e) {
            e.preventDefault();
            const cardId = e.dataTransfer.getData('text/plain');
            const card = document.getElementById(cardId);
            if (card && card !== draggedCard) return;

            if (card && area !== card.parentNode) {
                area.appendChild(card);
                makeCardDraggable(card);

                // --- Nova lògica: puntuació automàtica de plat ---
                if (area.id === 'playArea') {
                    const deckId = localStorage.getItem('selectedDeck') || 'healthy';
                    // Recollim totes les cartes actuals del plat
                    const playCards = Array.from(document.getElementById('playArea').querySelectorAll('.card'));
                    // Obtenim els ids de les cartes (pel nom o dataset)
                    const cardIds = playCards.map(c => {
                        if (c.dataset.ingredientId) return c.dataset.ingredientId;
                        const nameSpan = c.querySelector('span');
                        if (nameSpan && window.CARDS) {
                            const found = window.CARDS.find(i => i.name === nameSpan.textContent.trim());
                            if (found) return found.id;
                        }
                        return null;
                    }).filter(Boolean);

                    // Ingredients i begudes separats
                    const ingredientIds = cardIds.filter(id => {
                        const cardObj = window.CARDS.find(c => c.id === id);
                        return cardObj && cardObj.type === 'ingredient';
                    });
                    const drinkIds = cardIds.filter(id => {
                        const cardObj = window.CARDS.find(c => c.id === id);
                        return cardObj && cardObj.type === 'beguda';
                    });

                    // Puntuació base: suma de cada carta (bonus/penalització)
                    let scoreDelta = 0;
                    let feedbacks = [];
                    ingredientIds.forEach(ingredientId => {
                        if (window.isCardForbidden && window.isCardForbidden(deckId, ingredientId)) {
                            scoreDelta += -5;
                            feedbacks.push('Ingredient prohibit! -5 punts');
                        } else if (window.isCardBonus && window.isCardBonus(deckId, ingredientId)) {
                            scoreDelta += 3;
                            feedbacks.push('Ingredient coherent! +3 punts');
                        } else {
                            scoreDelta += 1;
                        }
                    });

                    // Sinergia de sabors
                    if (window.hasFlavorSynergy && window.hasFlavorSynergy(ingredientIds)) {
                        scoreDelta *= 2;
                        feedbacks.push('Sinergia de sabors! x2 punts');
                    }

                    // Compatibilitat de beguda (només una beguda per plat)
                    if (drinkIds.length > 0) {
                        const drinkId = drinkIds[0];
                        if (window.isDrinkCompatible && window.isDrinkCompatible(ingredientIds, drinkId)) {
                            scoreDelta += 15;
                            feedbacks.push('Beguda compatible! +15 punts');
                        } else {
                            scoreDelta -= 5;
                            feedbacks.push('Beguda incompatible! -5 punts');
                        }
                    }

                    // Actualitza puntuació
                    const scoreEl = document.getElementById('score');
                    if (scoreEl) {
                        let score = parseInt(scoreEl.textContent, 10) || 0;
                        score += scoreDelta;
                        scoreEl.textContent = score;
                    }
                    // Mostra feedback visual
                    const dishExplanation = document.getElementById('dishExplanation');
                    if (dishExplanation) {
                        dishExplanation.textContent = feedbacks.join(' | ') || '+1 punt';
                        dishExplanation.style.color = (scoreDelta < 0) ? '#e74c3c' : (scoreDelta > 1 ? '#27ae60' : '#b85c00');
                        setTimeout(() => {
                            dishExplanation.textContent = '';
                        }, 2200);
                    }
                    // Efecte visual a totes les cartes del plat
                    playCards.forEach(c => {
                        c.style.border = (scoreDelta < 0) ? '2px solid #e74c3c' : (scoreDelta > 1 ? '2px solid #27ae60' : '2px solid #b85c00');
                        c.style.boxShadow = (scoreDelta < 0) ? '0 0 12px #e74c3c88' : (scoreDelta > 1 ? '0 0 12px #27ae6088' : '0 0 8px #b85c0088');
                    });
                    setTimeout(() => {
                        playCards.forEach(c => {
                            c.style.border = '';
                            c.style.boxShadow = '';
                        });
                    }, 2200);
                }
            }
        });
    }

    // Habilitar drop en ambas zonas
    enableDropArea(hand);
    enableDropArea(playArea);
}
