'use strict'
function toggle_show(e) {
	const content = e.parentNode;
	$(content).toggleClass('show');
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
				if (type === "video") {
					const length = video.querySelector('.video-length')
					length.innerText = vi.duration?vi.duration:"00:00";
					length.style.display = null
				} else {
					const length = video.querySelector('.video-length')
					if (length) length.style.display = 'none'
					const videoIcon = document.createElement('svg');
					videoIcon.classList.add('video-icon');
					videoIcon.setAttribute('width', '100%');
					videoIcon.setAttribute('height', '100%');
					videoIcon.setAttribute('viewBox', '0 0 24 24');
					videoIcon.setAttribute('fill', 'none');
					videoIcon.innerHTML = [
						'<path d="M5 4.16C5 4.00536 5.12536 3.88 5.28 3.88H18.72C18.8746 3.88 19 4.00537 19 4.16V19.84C19 19.9946 18.8746 20.12 18.72 20.12H5.28C5.12536 20.12 5 19.9946 5 19.84V4.16Z" stroke="currentColor" stroke-width="1.5"></path>',
						'<path d="M7.52002 7.79999H16.48" stroke="currentColor" stroke-width="1.5"></path>',
						'<path d="M7.52002 11.16H12" stroke="currentColor" stroke-width="1.5"></path>'].join('');

					const imgIcon = video.querySelector('img');
					video.insertBefore(videoIcon, imgIcon);
					imgIcon.style.display = 'none';
				}
				video.setAttribute("data-url", vi.url);
				if (j === 0) {
					videoList.innerHTML = "";
				} 
				videoList.append(video)
			});
			if (index === 0) {
				this.outline_container.innerHTML = "";
			} 
			this.outline_container.append(content)
			// return course_content;
		});
	}
}


async function get_embed_code(url) {
	let _url = new URL(url);
	let domain = _url.hostname;
	let embed_code;
  
	switch (domain) {
	  case "www.youtube.com":
	  case "youtube.com":
	  case "youtu.be":
		const response = await fetch("https://www.youtube.com/oembed?url=" + url + "&format=json");
		const data = await response.json();
		embed_code = data["html"];
		break;
	  case "vimeo.com":
		// Use Vimeo's oEmbed API to get the embed code
		const response2 = await fetch("https://vimeo.com/api/oembed.json?url=" + url);
		const data2 = await response2.json();
		embed_code = data2["html"];
		break;
	  default:
		embed_code =
		  "<iframe src='"+url+"?rel=0&controls=1&autoplay=0&mute=0&start=0' frameborder='0' style='' allow='autoplay; encrypted-media' allowfullscreen=''></iframe>";
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
			let content = this.course_content.cloneNode(true);
			content.removeAttribute('id');
			let header = content.querySelector('.course-outline-item-header-learning');
			header.querySelector('.course-outline-item-order-learning').innerText = index + 1;
			header.querySelector('.course-learning-item-title').innerText = section.heading?section.heading:"";
			// header.querySelector('.course-outline-item-title-wrapper > .text-block').innerText = section.description?section.description:"";
			let videoList = content.querySelector('.video-item-list-learning');
			section.lessons.forEach((vi, j, a) => {
				let video = content.querySelector('.video-item-learning').cloneNode(true);
				video.querySelector('.video-name-learning').innerText = vi.title?vi.title:"";
				$(video).removeClass("current");
				// video.setAttribute("data-url", vi.url);
				video.addEventListener("click", async function() {
					const embed_code = await get_embed_code(vi.url);
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