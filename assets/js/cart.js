/* =========================================
   ESTIA Learning - Système de Panier Dynamique
   Fichier : /assets/js/cart.js
   ========================================= */

// Clé localStorage pour le panier
const CART_KEY = 'estia_learning_cart';

/**
 * Récupère le panier depuis localStorage
 * @returns {Array} Tableau des articles du panier
 */
function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

/**
 * Sauvegarde le panier dans localStorage
 * @param {Array} cart - Tableau des articles
 */
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

/**
 * Ajoute un article au panier
 * @param {Object} item - Article à ajouter {id, name, price, image, author}
 */
function addToCart(id, name, price, image = '', author = '') {
    const cart = getCart();
    
    // Vérifie si l'article existe déjà
    const existingIndex = cart.findIndex(item => item.id === id);
    
    if (existingIndex > -1) {
        // L'article existe, on incrémente la quantité
        cart[existingIndex].quantity += 1;
    } else {
        // Nouvel article
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            image: image,
            author: author,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification(`"${name}" ajouté au panier !`);
}

/**
 * Retire un article du panier (ou décrémente sa quantité)
 * @param {string} id - ID de l'article à retirer
 * @param {boolean} removeAll - Si true, supprime complètement l'article
 */
function removeFromCart(id, removeAll = false) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        if (removeAll || cart[itemIndex].quantity <= 1) {
            // Supprime complètement l'article
            cart.splice(itemIndex, 1);
        } else {
            // Décrémente la quantité
            cart[itemIndex].quantity -= 1;
        }
        saveCart(cart);
    }
}

/**
 * Incrémente la quantité d'un article
 * @param {string} id - ID de l'article
 */
function incrementItem(id) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        saveCart(cart);
        renderCartItems(); // Rafraîchit l'affichage
    }
}

/**
 * Décrémente la quantité d'un article
 * @param {string} id - ID de l'article
 */
function decrementItem(id) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart(cart);
        } else {
            removeFromCart(id, true);
        }
        renderCartItems(); // Rafraîchit l'affichage
    }
}

/**
 * Vide complètement le panier
 */
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    renderCartItems();
}

/**
 * Met à jour le badge du panier dans le header
 */
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Trouve tous les badges du panier
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

/**
 * Calcule le total du panier
 * @returns {Object} {subtotal, tva, total}
 */
function calculateCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tva = subtotal * 0.20; // TVA 20%
    const total = subtotal + tva;
    
    return {
        subtotal: subtotal.toFixed(2),
        tva: tva.toFixed(2),
        total: total.toFixed(2)
    };
}

/**
 * Affiche les articles du panier sur la page panier
 */
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('cart-empty-message');
    const summarySection = document.querySelector('.cart-summary-section');
    
    if (!cartContainer) return; // N'exécute que sur la page panier
    
    const cart = getCart();
    
    if (cart.length === 0) {
        // Panier vide
        cartContainer.innerHTML = '';
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (summarySection) summarySection.style.display = 'none';
        return;
    }
    
    // Cache le message vide, affiche le résumé
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (summarySection) summarySection.style.display = 'block';
    
    // Génère le HTML des articles
    let html = '';
    cart.forEach(item => {
        html += `
        <article class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <div class="img-placeholder" style="background-color: ${getRandomColor(item.id)};">${item.name.substring(0, 2).toUpperCase()}</div>
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="author">${item.author || 'ESTIA Learning'}</p>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="decrementItem('${item.id}')">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="incrementItem('${item.id}')">+</button>
            </div>
            <div class="item-price">
                <span class="current-price">${(item.price * item.quantity).toFixed(2)} €</span>
                <span class="unit-price">${item.price.toFixed(2)} € / unité</span>
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="removeFromCart('${item.id}', true); renderCartItems();" title="Supprimer">🗑️</button>
            </div>
        </article>
        `;
    });
    
    cartContainer.innerHTML = html;
    
    // Met à jour le récapitulatif
    updateCartSummary();
}

/**
 * Met à jour le récapitulatif du panier (sous-total, TVA, total)
 */
function updateCartSummary() {
    const totals = calculateCartTotal();
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const tvaEl = document.getElementById('cart-tva');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = totals.subtotal + ' €';
    if (tvaEl) tvaEl.textContent = totals.tva + ' €';
    if (totalEl) totalEl.textContent = totals.total + ' €';
}

/**
 * Affiche une notification temporaire
 * @param {string} message - Message à afficher
 */
function showNotification(message) {
    // Supprime les notifications existantes
    const existingNotif = document.querySelector('.cart-notification');
    if (existingNotif) existingNotif.remove();
    
    // Crée la notification
    const notif = document.createElement('div');
    notif.className = 'cart-notification';
    notif.innerHTML = `<span>✓</span> ${message}`;
    document.body.appendChild(notif);
    
    // Animation d'entrée
    setTimeout(() => notif.classList.add('show'), 10);
    
    // Supprime après 3 secondes
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

/**
 * Génère une couleur basée sur l'ID (pour les placeholders)
 * @param {string} id - ID de l'article
 * @returns {string} Couleur hex
 */
function getRandomColor(id) {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22'];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/**
 * Initialisation au chargement de la page
 */
function initCart() {
    updateCartBadge();
    renderCartItems();
}

// Exécute l'initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', initCart);
