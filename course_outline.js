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
			let content = this.course_content.cloneNode(true);
			content.removeAttribute('id');
			// content.setAttribute('fs-accordion-element', 'accordion');
			let header = content.querySelector('.course-outline-item-header');
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
				video.querySelector('.video-length').innerText = vi.duration?vi.duration:"00:00";
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

class CourseOutline extends Course {
	// <iframe id="course-video-container" src="https://player.vimeo.com/video/{{ $videouri }}?autoplay=true" width="100%" height="auto" style="min-height: 50%" frameborder="0" allow="autoplay"></iframe>
	
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
				// video.setAttribute("data-url", vi.url);
				video.addEventListener("click", (event) => {
					document.getElementById("course-video-container").setAttribute("src", vi.url);
					console.log("clicked" + vi.url);
					this.toggleClass("current");
				});
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