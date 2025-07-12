import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';

window.showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast-notification ${type}`;
    document.body.appendChild(toast);

    toast.addEventListener('animationend', () => {
        toast.remove();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('main-header');
    const footerContainer = document.getElementById('main-footer');

    if (headerContainer) {
        renderHeader(headerContainer);
    }
    
    if (footerContainer) {
        renderFooter(footerContainer);
    }


    lucide.createIcons();
});
