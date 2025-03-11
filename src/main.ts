import protected_page from './member';
window.protected_page = protected_page;

// Add type declaration
declare global {
    interface Window {
        protected_page: typeof protected_page;
    }
}

import './nav.js';
import './memberstack.extend.js'