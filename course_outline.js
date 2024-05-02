'use strict'
function toggle_show(e) {
	$(e.parentNode).toggleClass('show');
	const content = $(e).next('.course-outline-item-content');
	content.toggleClass('show');

	if (content.hasClass('show')) {
		content.height(content.get(0).scrollHeight);
	} else {
		content.height(0);
	}
	// const content = e.parentNode;
	// $(content).toggleClass('show');
}
class Course {
	constructor(outline_id, content_id) {
		this.course_content = document.getElementById(content_id);
		this.outline_container = this.course_content.parentNode;
		this.course_outline = document.getElementById(outline_id);
		this.outline_ = this.course_outline.querySelector("script").getAttribute("outline");
		this.course_outline.remove();
	}
	get_outline() {
		return JSON.parse(this.outline_);
	}
	render() {
		const outline = this.get_outline();
		outline.forEach((section, index, a) => {
			// render per section
			const content = this.course_content.cloneNode(true);
			content.removeAttribute('id');
			// content.setAttribute('fs-accordion-element', 'accordion');
			const header = content.querySelector('.course-outline-item-header');
			header.setAttribute('onclick', 'toggle_show(this)');
			// header.setAttribute('fs-accordion-element', 'trigger');
			header.querySelector('.course-outline-item-order').innerText = index + 1;
			header.querySelector('.course-outline-item-title').innerText = section.heading?section.heading:"";
			header.querySelector('.course-outline-item-title-wrapper > .text-block').innerText = section.description?section.description:"";
			let videoList = content.querySelector('.video-item-list');
			// videoList.parentNode.setAttribute('fs-accordion-element', 'content');
			section.lessons.forEach((vi, j, a) => {
				let video = content.querySelector('.video-item').cloneNode(true);
				video.querySelector('.video-name').innerText = vi.title?vi.title:"";
				const type = vi.type?vi.type:'video';
				const imgIcon = video.querySelector('img');
				if (type === "application/pdf") {
					const length = video.querySelector('.video-length')
					if (length) length.style.display = 'none'
					imgIcon.src = "https://uploads-ssl.webflow.com/649fb77ad1d9d9bbdbb2d8ec/66338651709765e61727c509_Document-tertiary.svg"
				} else {
					const length = video.querySelector('.video-length')
					length.innerText = vi.duration?vi.duration:"00:00";
					length.style.display = null
					imgIcon.src = "https://uploads-ssl.webflow.com/649fb77ad1d9d9bbdbb2d8ec/658a76a5dd7c62ee2ca69803_Video-tertiary.svg"
				}
				// video.setAttribute("data-url", vi.url);
				if (j === 0) {
					videoList.innerHTML = "";
				} 
				videoList.append(video)
			});
			if (index === 0) {
				this.outline_container.innerHTML = "";
			} 
			this.outline_container.append(content)
		});
	}
}


async function get_embed_code(url) {
	const _url = new URL(url);
	const domain = _url.hostname;
	let embed_code;
  
	switch (domain) {
	  case "www.youtube.com":
	  case "youtube.com":
	  case "youtu.be":
		const response = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
		const data = await response.json();
		embed_code = data.html;
		break;
	  case "vimeo.com":
		// Use Vimeo's oEmbed API to get the embed code
		const response2 = await fetch(`https://vimeo.com/api/oembed.json?url=${url}`);
		const data2 = await response2.json();
		embed_code = data2.html;
		break;
	  default:
		embed_code =
		  `<iframe src='${url}?rel=0&controls=1&autoplay=0&mute=0&start=0' frameborder='0' style='' allow='autoplay; encrypted-media' allowfullscreen=''></iframe>`;
	}
	const r = $.parseHTML(embed_code);
	const code = r[0];
	code.width = "100%";
	code.height = "auto";
	code.style = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:auto";
	return code;
  }

class CourseOutline extends Course {
	
	render() {
		const outline = this.get_outline();
		outline.forEach((section, index, a) => {
			// render per section
			const content = this.course_content.cloneNode(true);
			content.removeAttribute('id');
			const header = content.querySelector('.course-outline-item-header-learning');
			header.querySelector('.course-outline-item-order-learning').innerText = index + 1;
			header.querySelector('.course-learning-item-title').innerText = section.heading?section.heading:"";
			let videoList = content.querySelector('.video-item-list-learning');
			section.lessons.forEach((vi, j, a) => {
				let video = content.querySelector('.video-item-learning').cloneNode(true);
				video.querySelector('.video-name-learning').innerText = vi.title?vi.title:"";
				$(video).removeClass("current");
				// video.setAttribute("data-url", vi.url);
				const imgIcon = video.querySelector('img');
				
				const ico = vi.type === "application/pdf"?"66338651709765e61727c509_Document-tertiary.svg":"658a76a5dd7c62ee2ca69803_Video-tertiary.svg"
				imgIcon.src = `https://uploads-ssl.webflow.com/649fb77ad1d9d9bbdbb2d8ec/${ico}`
				
				video.addEventListener("click", async function() {
					const type = vi.type?vi.type:'video';
					let embed_code = ''
					embed_code = type === "application/pdf" ? [`<object data="${vi.url}" type="application/pdf" width="100%" height="100%">`,
					`<p>Download <a href="${vi.url}">${vi.title}</a></p>`, '</object'].join('') : await get_embed_code(vi.url);
					
					$("#course-video-container").html(embed_code);
					$(".current").removeClass("current");
					$(this).toggleClass("current");
				});
				if (j === 0) {
					$(videoList).empty();
				} 
				videoList.append(video)
			});
			if (index === 0) {
				$(this.outline_container).empty();
			} 
			this.outline_container.append(content)
			// return course_content;
		});
	}
}