/* =========================================
   ESTIA Learning - Système d'Authentification
   Fichier : /assets/js/auth.js
   ========================================= */

// Clés localStorage
const AUTH_KEY = 'estia_learning_auth';
const USER_KEY = 'estia_learning_user';

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean}
 */
function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

/**
 * Récupère les données de l'utilisateur connecté
 * @returns {Object|null}
 */
function getCurrentUser() {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Connexion de l'utilisateur
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean}
 */
function login(email, password) {
    // Validation simple (pas de vrai backend)
    if (!email || !password) {
        showAuthMessage('Veuillez remplir tous les champs', 'error');
        return false;
    }

    // Validation minimale pour le compte de test
    if (email.trim() === '' || password.trim() === '') {
        showAuthMessage('Veuillez remplir tous les champs', 'error');
        return false;
    }
    
    // Compte de test : email="123" / password="123"
    if (email === '123' && password === '123') {
        const user = {
            email: 'etudiant@estia.fr',
            username: 'etudiant',
            fullName: 'Étudiant ESTIA',
            loginDate: new Date().toISOString()
        };
        
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        showAuthMessage('Connexion réussie ! Redirection...', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
        
        return true;
    }
    
    // Validation email normale pour les autres comptes
    if (!email.includes('@')) {
        showAuthMessage('Email invalide. Utilisez 123/123 pour tester.', 'error');
        return false;
    }

    if (password.length < 4) {
        showAuthMessage('Le mot de passe doit contenir au moins 4 caractères', 'error');
        return false;
    }

    // Simulation de connexion réussie
    const user = {
        email: email,
        username: email.split('@')[0],
        fullName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        loginDate: new Date().toISOString()
    };

    // Stockage dans localStorage
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    showAuthMessage('Connexion réussie ! Redirection...', 'success');
    
    // Redirection vers le profil après 1 seconde
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);

    return true;
}

/**
 * Déconnexion de l'utilisateur
 */
function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    showAuthMessage('Déconnexion réussie', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 800);
}

/**
 * Redirige vers login si non authentifié
 */
function redirectIfNotAuthenticated() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

/**
 * Redirige vers profile si déjà authentifié
 */
function redirectIfAuthenticated() {
    if (isLoggedIn()) {
        window.location.href = 'profile.html';
    }
}

/**
 * Affiche un message d'authentification
 * @param {string} message 
 * @param {string} type - 'success' ou 'error'
 */
function showAuthMessage(message, type = 'info') {
    // Supprime les messages existants
    const existingMsg = document.querySelector('.auth-message');
    if (existingMsg) existingMsg.remove();

    // Crée le message
    const msgDiv = document.createElement('div');
    msgDiv.className = `auth-message auth-message-${type}`;
    msgDiv.textContent = message;
    
    // Trouve le container du formulaire ou crée un wrapper
    const form = document.querySelector('.login-form') || document.querySelector('.profile-container');
    if (form) {
        form.insertAdjacentElement('beforebegin', msgDiv);
    } else {
        document.body.appendChild(msgDiv);
    }

    // Supprime après 4 secondes
    setTimeout(() => {
        msgDiv.remove();
    }, 4000);
}

/**
 * Attache les écouteurs pour le formulaire de connexion
 */
function attachLoginListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            login(email, password);
        });
    }
}

/**
 * Attache les écouteurs pour la déconnexion
 */
function attachLogoutListeners() {
    const logoutBtns = document.querySelectorAll('.btn-logout');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
}

/**
 * Met à jour le header selon l'état de connexion
 */
function updateHeaderAuth() {
    // Détermine si on est dans le dossier /pages/ ou à la racine
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const loginPath = isInPagesFolder ? 'login.html' : 'pages/login.html';
    const profilePath = isInPagesFolder ? 'profile.html' : 'pages/profile.html';
    
    // Met à jour tous les liens "Profil" dans la navigation
    const profileLinks = document.querySelectorAll('.main-nav a');
    profileLinks.forEach(link => {
        if (link.textContent.trim() === 'Profil') {
            link.href = isLoggedIn() ? profilePath : loginPath;
        }
    });

    // Met à jour l'icône profil
    const profileIcon = document.querySelector('.icon-profile');
    if (profileIcon) {
        if (isLoggedIn()) {
            profileIcon.href = profilePath;
            profileIcon.title = 'Mon Profil';
        } else {
            profileIcon.href = loginPath;
            profileIcon.title = 'Se connecter';
        }
    }
}

/**
 * Affiche les informations utilisateur sur la page profil
 */
function displayUserProfile() {
    const user = getCurrentUser();
    if (!user) return;

    // Mise à jour du nom
    const usernameEl = document.getElementById('user-fullname');
    if (usernameEl) usernameEl.textContent = user.fullName;

    // Mise à jour de l'email
    const emailEl = document.getElementById('user-email');
    if (emailEl) emailEl.textContent = user.email;

    // Mise à jour de la date
    const dateEl = document.getElementById('user-login-date');
    if (dateEl) {
        const date = new Date(user.loginDate);
        dateEl.textContent = date.toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

/**
 * Initialisation au chargement de la page
 */
function initAuth() {
    updateHeaderAuth();
    attachLoginListeners();
    attachLogoutListeners();
    
    // Si on est sur la page profile, affiche les infos
    if (window.location.pathname.includes('profile.html')) {
        displayUserProfile();
    }
}

// Exécute l'initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', initAuth);
