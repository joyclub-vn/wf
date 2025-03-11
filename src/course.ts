import  { mobileAndTabletCheck, screenAspectRatio } from './utils'
import { Course, CourseOutline } from './course/outline';

const handleWindowResize = (event: Event) => {
	const player = document.querySelector('.course-learning-main');
	if (!player) return;

	if (screenAspectRatio() > 1.5) {
	  player.classList.add('sticky-on-top');
	} else {
	  player.classList.remove('sticky-on-top');
	}
}
window.addEventListener('load', handleWindowResize);
window.addEventListener('resize', handleWindowResize);

declare global {
	interface Window {
		Course: typeof Course;
		CourseOutline: typeof CourseOutline;
	}
}

window.Course = Course;
window.CourseOutline = CourseOutline;