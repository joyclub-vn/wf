'use strict'
class Course {
	constructor(outline_id, content_id) {
		this.course_outline = document.getElementById(outline_id);
		this.course_content = document.getElementById(content_id);
		this.outline_container = this.course_content.parentNode;
	}
	get_outline() {
		const outline_ = this.course_outline.querySelector("script").getAttribute("outline");
		return JSON.parse(outline_);
	}
	render() {
		const outline = this.get_outline();
		outline.forEach((e, i, a) => {
			// render per section
			let course_content = this.course_content.cloneNode(true);
			course_content.removeAttribute('id');
			course_content.querySelector('.course-outline-item-order').innerText = i;
			course_content.querySelector('.course-outline-item-title').innerText = e.heading?e.heading:"";
			course_content.querySelector('.course-outline-item-title-wrapper > .text-block').innerText = e.description?e.description:"";
			let videoList = course_content.querySelector('.video-item-list');
			e.lessons.forEach((vi, j, a) => {
				let video = course_content.querySelector('.video-item').cloneNode(true);
				video.querySelector('.video-name').innerText = vi.title?vi.title:"";
				video.querySelector('.video-length').innerText = vi.duration?vi.duration:"00:00";
				video.setAttribute("data-url", vi.url);
				if (j === 0) {
					videoList.innerHTML = "";
				} 
				videoList.append(video)
			});
			if (i === 0) {
				this.outline_container.innerHTML = "";
			} 
			this.outline_container.append(course_content)
			return course_content;
		});
	}
}
