'use strict'
class Course {
	constructor(outline_id, content_id) {
		this.course_content = document.getElementById(content_id);
		this.outline_container = this.course_content.parentNode;
		this.course_outline = document.getElementById(outline_id);
		this.outline_ = this.course_outline.querySelector("script").getAttribute("outline");
		this.course_outline.querySelector("script").parentElement.remove();
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
			content.querySelector('.course-outline-item-order').innerText = index + 1;
			content.querySelector('.course-outline-item-title').innerText = section.heading?section.heading:"";
			content.querySelector('.course-outline-item-title-wrapper > .text-block').innerText = section.description?section.description:"";
			let videoList = content.querySelector('.video-item-list');
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
