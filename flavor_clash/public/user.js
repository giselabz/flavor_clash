// Inicializa listeners de login y registro
function setupLoginRegisterListeners() {
    if (typeof loginForm !== 'undefined' && loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const name = 'Usuari temporal';
            const user = { name, email, password: '', avatar: '', progress: '' };

            let users = getUsers();
            const exists = users.find(u => u.email === email);
            if (!exists) {
                users.push(user);
                saveUsers(users);
            }

            setSession(email);
            showMainMenu(user);
        };
    }

    if (typeof registerForm !== 'undefined' && registerForm) {
        registerForm.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value.trim() || 'Usuari nou';
            const email = document.getElementById('registerEmail').value.trim();
            const avatar = document.getElementById('registerAvatar').value.trim();
            const user = { name, email, password: '', avatar, progress: '' };

            let users = getUsers();
            const exists = users.find(u => u.email === email);
            if (!exists) {
                users.push(user);
                saveUsers(users);
            }

            setSession(email);
            showMainMenu(user);
        };
    }
}


window.setupLoginRegisterListeners = setupLoginRegisterListeners;
// user.js
// Gestión de usuario, sesión y perfil

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function setSession(email) {
    localStorage.setItem('session', email);
}
function getSession() {
    return localStorage.getItem('session');
}
function clearSession() {
    localStorage.removeItem('session');
}
function getCurrentUser() {
    const email = getSession();
    if (!email) return null;
    return getUsers().find(u => u.email === email) || null;
}
function updateCurrentUser(newData) {
    const users = getUsers();
    const idx = users.findIndex(u => u.email === newData.email);
    if (idx !== -1) {
        users[idx] = newData;
        saveUsers(users);
    }
}
function ensureUserFields(user) {
    if (user.flavorPoints === undefined) user.flavorPoints = 20;
    if (!user.inventory) user.inventory = [];
    return user;
}
// Export (para uso global)
window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.setSession = setSession;
window.getSession = getSession;
window.clearSession = clearSession;
window.getCurrentUser = getCurrentUser;
window.updateCurrentUser = updateCurrentUser;
window.ensureUserFields = ensureUserFields;
