'use strict'
window.mobileAndTabletCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

const screenAspectRatio = () => {
	const { innerHeight, innerWidth } = window;
	const { height, width } = screen;
	return (innerHeight || height) / (innerWidth || width);
};
const handleWindowResize = (event) => {
	const $player = $('.course-learning-main')
	if (!$player) return

	if (screenAspectRatio() > 1.5) {
	  $player.addClass('sticky-on-top')
	} else {
	  $player.removeClass('sticky-on-top')
	}
}

$(window).on('load resize', handleWindowResize)
  
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
					
					if (vi.preview) {
						video.querySelector('a').style = "cursor: pointer"
						video.addEventListener("click", () => {
							const modal_id = 'video-preview-lesson'
							setModalEmbedCode(modal_id, vi.url)
							MicroModal.show(modal_id, {
								onShow: modal => console.log(`Open ${vi.url}`),
								disableScroll: true,
								awaitOpenAnimation: true,
							});
						});
					} else {
						video.querySelector('a').style = "cursor: text"
					}
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

async function setModalEmbedCode(modal_id, url) {
	const embedCode = await get_embed_code(url);
	$(`#${modal_id} .preview-lesson`).html(embedCode);
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
					
					if (window.mobileAndTabletCheck()) {
						if (screenAspectRatio() <= 1.5) $("html, body").animate({ scrollTop: 0 }, "slow");
						if (type === "application/pdf") window.open(vi.url)
					} 
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


