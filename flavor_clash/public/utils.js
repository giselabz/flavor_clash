// utils.js
// Helpers comuns

function hideAllSections() {
    mainMenu.style.display = 'none';
    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('settingsSection').style.display = 'none';
    document.getElementById('shopSection').style.display = 'none';
    document.getElementById('minigamesSection').style.display = 'none';
    if (document.getElementById('inventorySection')) document.getElementById('inventorySection').style.display = 'none';
}
function showMenuError(msg) {
    document.getElementById('menuError').textContent = msg;
}
function clearMenuError() {
    document.getElementById('menuError').textContent = '';
}
window.hideAllSections = hideAllSections;
window.showMenuError = showMenuError;
window.clearMenuError = clearMenuError;
