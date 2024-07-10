'use strict';

// Link data from CMS does not allow adding pre or post string
// => cannot add negative data-ms-content
$('[data-ms-not-content]').each(function() {
  const $element = $(this);
  const contentID = $element.data('ms-not-content');
  $element.data('ms-content', `!${contentID}`);
  $element.removeAttr('data-ms-not-content');
});

/* SHOW EMAIL WHEN THERE'S NO NAME, HIDE EMAIL WHEN THERE'S NAME */
$(document).ready(() => {
	const msMem = JSON.parse(localStorage.getItem('_ms-mem'));
	if (msMem?.customFields) {
	  if (msMem.customFields['member-name'] && $.trim(msMem.customFields['member-name'])) {
		// If there is a name, show only the name element
		$('#member-name').show();
		$('#member-name-inside-menu').show();
		$('#member-email').hide();
		$('#member-email-inside-menu').hide();
	  } else {
		// If there is no name, show only the email element
		$('#member-email').show();
		$('#member-email-inside-menu').show();
		$('#member-name').hide();
		$('#member-name-inside-menu').hide();
	  }
	}
  });


  /* 💙 MEMBERSCRIPT #23 v0.1 💙 SKELETON SCREENS/CONTENT LOADERS */
  window.addEventListener("DOMContentLoaded", (event) => {
	const skeletonElements = document.querySelectorAll('[ms-code-skeleton]');
	
	skeletonElements.forEach(element => {
	  // Create a skeleton div
	  const skeletonDiv = document.createElement('div');
	  skeletonDiv.classList.add('skeleton-loader');
  
	  // Add the skeleton div to the current element
	  element.style.position = 'relative';
	  element.appendChild(skeletonDiv);
  
	  // Get delay from the attribute
	  let delay = element.getAttribute('ms-code-skeleton');
  
	  // If attribute value is not a number, set default delay as 2000ms
	  if (isNaN(delay)) {
		delay = 2000;
	  }
  
	  setTimeout(() => {
		// Remove the skeleton loader div after delay
		const skeletonDiv = element.querySelector('.skeleton-loader');
		element.removeChild(skeletonDiv);
	  }, delay);
	});
  });