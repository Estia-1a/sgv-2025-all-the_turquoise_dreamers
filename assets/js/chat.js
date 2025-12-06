/* =========================================
   ESTIA Learning - Système de Chat
   Fichier : /assets/js/chat.js
   ========================================= */

// Clé localStorage pour les messages
const CHAT_KEY = 'estia_learning_chat';

// Données utilisateur par défaut
const BOT_USER = {
    name: 'Assistant ESTIA',
    avatar: '🤖',
    id: 'bot'
};

/**
 * Récupère les messages depuis localStorage
 * @returns {Array} Tableau des messages
 */
function loadMessages() {
    const messages = localStorage.getItem(CHAT_KEY);
    return messages ? JSON.parse(messages) : [];
}

/**
 * Sauvegarde les messages dans localStorage
 * @param {Array} messages - Tableau des messages
 */
function saveMessages(messages) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

/**
 * Récupère l'utilisateur connecté
 * @returns {Object|null} Utilisateur ou null
 */
function getCurrentChatUser() {
    // Utilise la fonction de auth.js si disponible
    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user) {
            return {
                name: user.fullName || user.username,
                avatar: user.username ? user.username.charAt(0).toUpperCase() : '👤',
                id: user.email
            };
        }
    }
    
    // Utilisateur par défaut si non connecté
    return {
        name: 'Invité',
        avatar: '👤',
        id: 'guest'
    };
}

/**
 * Formate l'heure au format HH:MM
 * @param {Date} date - Date à formater
 * @returns {string} Heure formatée
 */
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Formate la date complète
 * @param {Date} date - Date à formater
 * @returns {string} Date formatée
 */
function formatDate(date) {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (today.toDateString() === messageDate.toDateString()) {
        return "Aujourd'hui";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (yesterday.toDateString() === messageDate.toDateString()) {
        return "Hier";
    }
    
    return messageDate.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long' 
    });
}

/**
 * Envoie un nouveau message
 * @param {string} content - Contenu du message
 */
function sendMessage(content) {
    if (!content || content.trim() === '') return;
    
    const messages = loadMessages();
    const currentUser = getCurrentChatUser();
    
    const newMessage = {
        id: Date.now(),
        content: content.trim(),
        timestamp: new Date().toISOString(),
        user: currentUser,
        type: 'sent'
    };
    
    messages.push(newMessage);
    saveMessages(messages);
    renderMessages();
    
    // Simule une réponse du bot après un délai
    setTimeout(() => {
        simulateBotReply(content);
    }, 1000 + Math.random() * 2000);
}

/**
 * Simule une réponse automatique du bot
 * @param {string} userMessage - Message de l'utilisateur
 */
function simulateBotReply(userMessage) {
    const messages = loadMessages();
    
    // Réponses prédéfinies selon le contenu
    let botResponse = '';
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
        botResponse = 'Bonjour ! Comment puis-je vous aider aujourd\'hui ? 😊';
    } else if (lowerMessage.includes('cours') || lowerMessage.includes('formation')) {
        botResponse = 'Nous proposons 6 formations exceptionnelles ! Consultez notre catalogue pour découvrir Python, UX/UI Design, JavaScript, Agile, IA et React.js. 📚';
    } else if (lowerMessage.includes('prix') || lowerMessage.includes('tarif')) {
        botResponse = 'Nos cours sont à partir de 29,99 €. Consultez la page Cours pour voir tous les tarifs ! 💰';
    } else if (lowerMessage.includes('panier') || lowerMessage.includes('acheter')) {
        botResponse = 'Vous pouvez ajouter des cours à votre panier directement depuis la page Cours avec les boutons +/- ! 🛒';
    } else if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('?')) {
        botResponse = 'Je suis là pour vous aider ! Posez-moi des questions sur nos cours, les tarifs, ou la navigation sur le site. 🎓';
    } else if (lowerMessage.includes('merci')) {
        botResponse = 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. 😊';
    } else {
        const responses = [
            'Merci pour votre message ! Un conseiller vous répondra bientôt. 📩',
            'Message bien reçu ! Comment puis-je vous aider ? 💬',
            'Intéressant ! Pouvez-vous m\'en dire plus ? 🤔',
            'Je prends note de votre demande. Besoin d\'autres informations ? 📝',
            'Excellente question ! Notre équipe va vous répondre rapidement. ⚡'
        ];
        botResponse = responses[Math.floor(Math.random() * responses.length)];
    }
    
    const botMessage = {
        id: Date.now(),
        content: botResponse,
        timestamp: new Date().toISOString(),
        user: BOT_USER,
        type: 'received'
    };
    
    messages.push(botMessage);
    saveMessages(messages);
    renderMessages();
}

/**
 * Affiche tous les messages dans l'interface
 */
function renderMessages() {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;
    
    const messages = loadMessages();
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="empty-chat">
                <div class="empty-icon">💬</div>
                <h3>Bienvenue sur le chat ESTIA Learning !</h3>
                <p>Commencez la conversation en envoyant un message.</p>
            </div>
        `;
        return;
    }
    
    // Regroupe les messages par date
    const messagesByDate = {};
    messages.forEach(msg => {
        const date = formatDate(new Date(msg.timestamp));
        if (!messagesByDate[date]) {
            messagesByDate[date] = [];
        }
        messagesByDate[date].push(msg);
    });
    
    // Génère le HTML
    let html = '';
    Object.keys(messagesByDate).forEach(date => {
        html += `<div class="date-separator">${date}</div>`;
        
        messagesByDate[date].forEach(msg => {
            const time = formatTime(new Date(msg.timestamp));
            const bubbleClass = msg.type === 'sent' ? 'bubble-right' : 'bubble-left';
            
            html += `
                <div class="message ${bubbleClass}">
                    <div class="avatar">${msg.user.avatar}</div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="username">${msg.user.name}</span>
                            <span class="timestamp">${time}</span>
                        </div>
                        <div class="message-text">${escapeHtml(msg.content)}</div>
                    </div>
                </div>
            `;
        });
    });
    
    messagesContainer.innerHTML = html;
    autoScroll();
}

/**
 * Échappe les caractères HTML pour éviter les injections
 * @param {string} text - Texte à échapper
 * @returns {string} Texte échappé
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Scroll automatique vers le dernier message
 */
function autoScroll() {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

/**
 * Efface tout l'historique des messages
 */
function clearChatHistory() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique du chat ?')) {
        localStorage.removeItem(CHAT_KEY);
        renderMessages();
    }
}

/**
 * Initialise le chat
 */
function initChat() {
    // Redirige vers login si fonction disponible et utilisateur non connecté
    if (typeof redirectIfNotAuthenticated === 'function') {
        redirectIfNotAuthenticated();
    }
    
    // Affiche les messages existants
    renderMessages();
    
    // Gère l'envoi de message
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    
    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', () => {
            const content = messageInput.value;
            sendMessage(content);
            messageInput.value = '';
            messageInput.focus();
        });
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const content = messageInput.value;
                sendMessage(content);
                messageInput.value = '';
            }
        });
    }
    
    // Bouton effacer historique
    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearChatHistory);
    }
    
    // Message de bienvenue automatique si premier lancement
    const messages = loadMessages();
    if (messages.length === 0) {
        setTimeout(() => {
            const welcomeMessage = {
                id: Date.now(),
                content: 'Bonjour et bienvenue sur ESTIA Learning ! 👋 Je suis votre assistant virtuel. N\'hésitez pas à me poser des questions sur nos formations, nos tarifs ou notre plateforme.',
                timestamp: new Date().toISOString(),
                user: BOT_USER,
                type: 'received'
            };
            const msgs = loadMessages();
            msgs.push(welcomeMessage);
            saveMessages(msgs);
            renderMessages();
        }, 500);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initChat);
