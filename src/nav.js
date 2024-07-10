/* DISABLE SCROLL WHEN SIGNIN MODAL APPEARS */  
document.addEventListener('DOMContentLoaded', function() {
	// Listen for click on signin button
	const signinButtons = document.querySelectorAll('.signin-button');
	  const signinModal = document.querySelector('.signin-modal');
	signinButtons.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.add('no-scroll');
			  signinModal.classList.add('scroll');
		});
	});

	// Listen for click on close modal button
	const closeModalButtons = document.querySelectorAll('.close-modal-signin, .modal-outside');
	closeModalButtons.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.remove('no-scroll');
			  signinModal.classList.remove('scroll');
		});
	});
});

/* DISABLE SCROLL WHEN MOBILE MENU APPEARS */  
document.addEventListener('DOMContentLoaded', function() {
	// Listen for click on signin button
	const menuOpen = document.querySelectorAll('.menu-open');
	menuOpen.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.add('no-scroll');
		});
	});

	// Listen for click on close modal button
	const menuClose = document.querySelectorAll('.menu-close, .menu-outside');
	menuClose.forEach(button => {
		button.addEventListener('click', function() {
			document.body.classList.remove('no-scroll');
		});
	});
});

/* HIDE NAV BAR WHEN SCROLL DOWN, SHOW WHEN SCROLL UP */
  document.addEventListener('DOMContentLoaded', function() {
	let lastScrollTop = 0;
	let scrollStartPos = null; // Initialize variable to store the start position of a scroll down

	window.addEventListener('scroll', function() {
		let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
		  const navigation = document.querySelector('.navigation-bar')

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