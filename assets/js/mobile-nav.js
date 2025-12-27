/**
 * Mobile Navigation Toggle
 * Gère l'ouverture/fermeture du menu mobile sur petits écrans
 */

(function() {
    'use strict';
    
    function initMobileNav() {
        const header = document.querySelector('.site-header');
        const mainNav = document.querySelector('.main-nav');
        
        if (!header || !mainNav) return;
        
        // Créer le bouton toggle s'il n'existe pas déjà
        let navToggle = header.querySelector('.nav-toggle');
        
        if (!navToggle) {
            navToggle = document.createElement('button');
            navToggle.className = 'nav-toggle';
            navToggle.innerHTML = '☰ Menu';
            navToggle.setAttribute('aria-label', 'Toggle navigation');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Insérer le bouton dans le header-top
            const headerTop = header.querySelector('.header-top');
            if (headerTop) {
                headerTop.appendChild(navToggle);
            }
        }
        
        // Gestion du clic sur le bouton toggle
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isExpanded = mainNav.classList.toggle('nav-expanded');
            navToggle.setAttribute('aria-expanded', isExpanded);
            navToggle.innerHTML = isExpanded ? '✕ Fermer' : '☰ Menu';
        });
        
        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
                mainNav.classList.remove('nav-expanded');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '☰ Menu';
            }
        });
        
        // Fermer le menu lors du redimensionnement vers desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 600) {
                mainNav.classList.remove('nav-expanded');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '☰ Menu';
            }
        });
        
        // Fermer le menu lors du clic sur un lien
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('nav-expanded');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '☰ Menu';
            });
        });
    }
    
    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();


