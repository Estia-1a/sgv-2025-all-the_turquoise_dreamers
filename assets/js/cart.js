/* =========================================
   ESTIA Learning - Système de Panier Dynamique
   Fichier : /assets/js/cart.js
   ========================================= */

// Clé localStorage pour le panier
const CART_KEY = 'estia_learning_cart';

// Mapping des métadonnées des cours (catégories, couleurs, icônes, niveaux, ratings)
const COURSES_METADATA = {
    'python-101': {
        categoryName: 'Python',
        categoryColor: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        categoryIcon: '🐍',
        level: 'beginner',
        levelText: 'Débutant',
        rating: '4.8'
    },
    'uxui-master': {
        categoryName: 'Design',
        categoryColor: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
        categoryIcon: '🎨',
        level: 'intermediate',
        levelText: 'Intermédiaire',
        rating: '4.9'
    },
    'js-advanced': {
        categoryName: 'JavaScript',
        categoryColor: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
        categoryIcon: '⚡',
        level: 'advanced',
        levelText: 'Avancé',
        rating: '4.7'
    },
    'agile-101': {
        categoryName: 'Gestion',
        categoryColor: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        categoryIcon: '📋',
        level: 'beginner',
        levelText: 'Débutant',
        rating: '4.6'
    },
    'ai-intro': {
        categoryName: 'IA',
        categoryColor: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
        categoryIcon: '🤖',
        level: 'advanced',
        levelText: 'Avancé',
        rating: '4.9'
    },
    'react-az': {
        categoryName: 'React',
        categoryColor: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
        categoryIcon: '⚛️',
        level: 'intermediate',
        levelText: 'Intermédiaire',
        rating: '4.8'
    }
};

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
    updateCourseQuantities(); // Mise à jour des quantités sur la page cours
}

/**
 * Ajoute un article au panier
 * @param {string} id - ID de l'article
 * @param {string} name - Nom de l'article
 * @param {number} price - Prix de l'article
 * @param {string} image - Image (optionnel)
 * @param {string} author - Auteur (optionnel)
 */
function addToCart(id, name, price, image = '', author = '') {
    const cart = getCart();
    
    // Récupère les métadonnées du cours
    const metadata = COURSES_METADATA[id] || {
        categoryName: 'Formation',
        categoryColor: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
        categoryIcon: '📚',
        level: 'beginner',
        levelText: 'Débutant',
        rating: '4.5'
    };
    
    // Vérifie si l'article existe déjà
    const existingIndex = cart.findIndex(item => item.id === id);
    
    if (existingIndex > -1) {
        // L'article existe, on incrémente la quantité
        cart[existingIndex].quantity += 1;
    } else {
        // Nouvel article avec métadonnées complètes
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            image: image,
            author: author,
            quantity: 1,
            categoryName: metadata.categoryName,
            categoryColor: metadata.categoryColor,
            categoryIcon: metadata.categoryIcon,
            level: metadata.level,
            levelText: metadata.levelText,
            rating: metadata.rating
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
        renderCartItems(); // Rafraîchit la page panier si on y est
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
        renderCartItems();
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
        renderCartItems();
    }
}

/**
 * Vide complètement le panier
 */
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    updateCourseQuantities();
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
 * Met à jour les quantités affichées sur la page cours
 */
function updateCourseQuantities() {
    const cart = getCart();
    
    // Trouve tous les affichages de quantité sur la page cours
    const qtyDisplays = document.querySelectorAll('.qty-display');
    
    qtyDisplays.forEach(display => {
        const courseId = display.id.replace('qty-', '');
        const item = cart.find(i => i.id === courseId);
        const qty = item ? item.quantity : 0;
        display.textContent = qty;
        
        // Ajoute/retire une classe pour styler si quantité > 0
        if (qty > 0) {
            display.classList.add('has-items');
        } else {
            display.classList.remove('has-items');
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
        subtotal: subtotal,
        tva: tva,
        total: total
    };
}

/**
 * Affiche les articles du panier sur la page panier
 */
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('cart-empty-message');
    // Support both desktop (cart-summary-section) and mobile (cart-summary)
    const summarySection = document.querySelector('.cart-summary-section') || document.querySelector('.cart-summary');
    
    if (!cartContainer) return; // N'exécute que sur la page panier
    
    const cart = getCart();
    
    if (cart.length === 0) {
        // Panier vide
        cartContainer.innerHTML = '';
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (summarySection) {
            summarySection.style.display = 'none';
        }
        return;
    }
    
    // Cache le message vide, affiche le résumé
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (summarySection) summarySection.style.display = 'block';
    
    // Génère le HTML des articles avec le MÊME style que cours.html
    let html = '';
    cart.forEach(item => {
        // Récupère les métadonnées (si anciennes données sans metadata)
        const metadata = item.categoryName ? item : COURSES_METADATA[item.id] || {};
        const categoryName = metadata.categoryName || 'Formation';
        const categoryColor = metadata.categoryColor || 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
        const categoryIcon = metadata.categoryIcon || '📚';
        const level = metadata.level || 'beginner';
        const levelText = metadata.levelText || 'Débutant';
        const rating = metadata.rating || '4.5';
        
        html += `
        <article class="cart-course-card" data-id="${item.id}">
            <div class="course-image" style="background: ${categoryColor};">
                <span class="category-badge">${categoryName}</span>
                <span class="course-icon">${categoryIcon}</span>
            </div>
            <div class="course-content">
                <h3>${item.name}</h3>
                <p class="course-author">Par ${item.author || 'ESTIA Learning'}</p>
                <div class="course-meta">
                    <span class="rating">⭐ ${rating}</span>
                    <span class="level ${level}">${levelText}</span>
                </div>
                <div class="course-price">
                    <span class="price">${item.price.toFixed(2)} €</span>
                    <span class="unit-label">× ${item.quantity}</span>
                    <span class="total-price">${(item.price * item.quantity).toFixed(2)} €</span>
                </div>
                <div class="cart-actions">
                    <button class="btn-qty btn-minus" onclick="decrementItem('${item.id}')">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="btn-qty btn-plus" onclick="incrementItem('${item.id}')">+</button>
                    <button class="btn-remove" onclick="removeFromCart('${item.id}', true); renderCartItems();" title="Supprimer">🗑️</button>
                </div>
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
    
    if (subtotalEl) subtotalEl.textContent = totals.subtotal.toFixed(2) + ' €';
    if (tvaEl) tvaEl.textContent = totals.tva.toFixed(2) + ' €';
    if (totalEl) totalEl.textContent = totals.total.toFixed(2) + ' €';
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
 * Met à jour les anciens articles du panier avec les nouvelles métadonnées
 */
function migrateCartData() {
    const cart = getCart();
    let needsUpdate = false;
    
    cart.forEach(item => {
        // Si l'article n'a pas de métadonnées, on les ajoute
        if (!item.categoryName && COURSES_METADATA[item.id]) {
            const metadata = COURSES_METADATA[item.id];
            item.categoryName = metadata.categoryName;
            item.categoryColor = metadata.categoryColor;
            item.categoryIcon = metadata.categoryIcon;
            item.level = metadata.level;
            item.levelText = metadata.levelText;
            item.rating = metadata.rating;
            needsUpdate = true;
        }
    });
    
    if (needsUpdate) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
}

/**
 * Initialisation au chargement de la page
 */
function initCart() {
    migrateCartData(); // Mise à jour des anciennes données
    updateCartBadge();
    updateCourseQuantities(); // Met à jour les quantités sur la page cours
    renderCartItems();
}

// Exécute l'initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', initCart);
