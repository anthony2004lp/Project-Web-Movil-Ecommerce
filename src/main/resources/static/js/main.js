/* main.js - Common interactions for All Process S.A.C. */

document.addEventListener('DOMContentLoaded', () => {
    initNavigationToggles();
});

/**
 * Handles all navigation and sidebar toggles across the application
 */
function initNavigationToggles() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const sidebar = document.getElementById('sidebar');
    const navActions = document.querySelector('.nav-actions') || document.getElementById('topbarActions');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Toggle classes
            if (mainNav) mainNav.classList.toggle('open');
            if (sidebar) sidebar.classList.toggle('open');
            if (navActions) navActions.classList.toggle('open');
            
            // Update aria-expanded
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
    }
}

/**
 * Utility to format currency values
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(amount);
}
