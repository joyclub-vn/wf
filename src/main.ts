import protected_page from './member';
import active_nav from './nav';
window.protected_page = protected_page;

import './nav';
window.active_nav = active_nav;
import './memberstack.extend.js'

// Add type declaration
declare global {
    interface Window {
        protected_page: typeof protected_page;
        active_nav: typeof active_nav;
    }
}