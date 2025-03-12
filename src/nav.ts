'use strict';
/* DISABLE SCROLL WHEN SIGNIN MODAL APPEARS */  
document.addEventListener('DOMContentLoaded', function() {
	// Listen for click on signin button
	const signinButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.signin-button');
	const signinModal: HTMLElement | null = document.querySelector('.signin-modal');
	signinButtons.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.add('no-scroll');
			signinModal?.classList.add('scroll');
		});
	});

	// Listen for click on close modal button
	const closeModalButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.close-modal-signin, .modal-outside');
	closeModalButtons.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.remove('no-scroll');
			signinModal?.classList.remove('scroll');
		});
	});
});

/* DISABLE SCROLL WHEN MOBILE MENU APPEARS */  
document.addEventListener('DOMContentLoaded', function() {
	// Listen for click on signin button
	const menuOpen: NodeListOf<HTMLElement> = document.querySelectorAll('.menu-open');
	menuOpen.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.add('no-scroll');
		});
	});

	// Listen for click on close modal button
	const menuClose: NodeListOf<HTMLElement> = document.querySelectorAll('.menu-close, .menu-outside');
	menuClose.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.remove('no-scroll');
		});
	});
});

/* HIDE NAV BAR WHEN SCROLL DOWN, SHOW WHEN SCROLL UP */
document.addEventListener('DOMContentLoaded', function() {
	let lastScrollTop: number = 0;
	let scrollStartPos: number | null = null; // Initialize variable to store the start position of a scroll down

	window.addEventListener('scroll', function() {
		let currentScroll: number = window.pageYOffset || document.documentElement.scrollTop;
		const navigation: HTMLElement | null = document.querySelector('.navigation-bar')

		if (currentScroll > lastScrollTop) {
			// Scrolling down
			if (scrollStartPos === null) {
				scrollStartPos = lastScrollTop; // Record the position when starting to scroll down
			}
			if (currentScroll - scrollStartPos >= 420) {
				// If scrolled down at least 48px from the start position
				if (navigation) navigation.classList.add('up');
			}
		} else {
			// Scrolling up
			if (navigation) navigation.classList.remove('up');
			scrollStartPos = null; // Reset start position
		}

		lastScrollTop = currentScroll; // Update the last scroll position to current
	}, false);
});

/**
 * Toggles the 'current' class on navigation items based on the provided name.
 * 
 * @param {string} name - The name of the navigation item to be marked as current.
 */
export default function active_nav(name: string): void {
	document.querySelectorAll('.nav-item-desktop .nav-item').forEach((e: Element) => {
		const is_current: boolean = e.getAttribute('data-menu-name') === name;
		e.classList.toggle('inactive', !is_current);
		e.classList.toggle('current', is_current);
		e.querySelector('.nav-indicator.current')?.remove();
		if (is_current) {
			const indicator: HTMLDivElement = document.createElement('div');
			indicator.classList.add('nav-indicator', 'current');
			e.appendChild(indicator);
		}
	});
}