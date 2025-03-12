import {CF_URL, Icon} from '../consts'
import  { mobileAndTabletCheck, screenAspectRatio } from '../utils'

import MicroModal from 'micromodal'; 

async function get_embed_code(url: string): Promise<HTMLIFrameElement> {
	const _url = new URL(url);
	const domain = _url.hostname;
	let embed_code: string;
  
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
	const parser = new DOMParser();
	const doc = parser.parseFromString(embed_code, "text/html");
	const code = doc.documentElement as HTMLIFrameElement;
	code.width = "100%";
	code.height = "auto";
	code.style.position = "absolute";
	code.style.left = "0";
	code.style.top = "0";
	code.style.width = "100%";
	code.style.height = "100%";
	code.style.pointerEvents = "auto";
	return code;
}

async function setModalEmbedCode(modal_id: string, url: string) {
	const embedCode = await get_embed_code(url);
	document.getElementById(`${modal_id} .preview-lesson`).innerHTML = embedCode.outerHTML;
}

export class Course {
    protected course_content: HTMLElement;
    protected outline_container: HTMLElement;
    protected outline: any[];
    protected init_first_lesson: boolean;
    protected config: {
        headerClass: string;
        orderClass: string;
        titleClass: string;
        videoListClass: string;
        videoItemClass: string;
        videoNameClass: string;
    };

    constructor(outline_id: string, content_id: string) {
        this.course_content = document.getElementById(content_id);
        this.outline_container = this.course_content.parentNode as HTMLElement;
        this.config = {
            headerClass: '.course-outline-item-header',
            orderClass: '.course-outline-item-order',
            titleClass: '.course-outline-item-title',
            videoListClass: '.video-item-list',
            videoItemClass: '.video-item',
            videoNameClass: '.video-name'
        };
        
        this.get_outline(outline_id).then(async outline => {
            this.render(outline)
            // this.outline = outline;
            if (this.init_first_lesson && outline.length > 0) {
                const player = document.getElementById("course-video-container");
                if (player){
                    const firstSection = outline[0];
                    const firstLesson = firstSection.lessons[0];
                    if (firstLesson) {
                        const embedCode = await get_embed_code(firstLesson.url);
                        player.innerHTML = embedCode.outerHTML;
                    }
                }
            }
        }).catch(error => console.error("Error rendering outline:", error));
    }

    get_outline(slug: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!slug.startsWith('/')) {
                const course_outline = document.getElementById(slug);
                const outline_ = course_outline.querySelector("script").getAttribute("outline");
                course_outline.remove();
                resolve(JSON.parse(outline_));
            } else {
                fetch(`${CF_URL}${slug}.json`, {
                    method: "GET",
                    cache: "force-cache" // Uses cache first, then network if unavailable
                  }).then(response => response.json())
                  .then(data => resolve(data))
                  .catch(error => reject(`Error fetching outline data: ${error}`));   
            }   
        });
    }
    
    toggle_show(e: HTMLElement) {
        (e.parentNode as HTMLElement).classList.toggle('show');
        const content = e.nextElementSibling as HTMLElement;
        content.classList.toggle('show');
    
        if (content.classList.contains('show')) {
            content.style.height = content.scrollHeight + 'px';
        } else {
            content.style.height = '0';
        }
    }

    protected renderVideo(video: HTMLElement, vi: any, isPreview = false): void {
        const name = video.querySelector(this.config.videoNameClass) as HTMLElement;
        name.innerText = vi.title || "";
        name.classList.toggle('link-span', false);
        name.classList.toggle('link-disabled', true);
        const type = vi.type || 'video';
        const imgIcon = video.querySelector('img') as HTMLImageElement;
        imgIcon.src = type === "application/pdf" ? Icon.pdf : Icon.video;

        if (type === "application/pdf") {
            const length = video.querySelector('.video-length') as HTMLElement;
            if (length) length.style.display = 'none';
        } else if (isPreview) {
            name.classList.toggle('link-disabled', false);
            name.classList.toggle('link-span', true);
            video.addEventListener("click", () => {
                const modal_id = 'video-preview-lesson';
                setModalEmbedCode(modal_id, vi.url);
                MicroModal.show(modal_id, {
                    onShow: modal => console.log(`Open ${vi.url}`),
                    disableScroll: true,
                    awaitOpenAnimation: true,
                });
            });
        }
    }

    render(outline: any[]): void {
        outline.forEach((section: any, index: number) => {
            const content = this.course_content.cloneNode(true) as HTMLElement;
            content.removeAttribute('id');
            
            const header = content.querySelector(this.config.headerClass) as HTMLElement;
            const orderElement = header.querySelector(this.config.orderClass) as HTMLElement;
            const titleElement = header.querySelector(this.config.titleClass) as HTMLElement;
            const descriptionElement = header.querySelector('.course-outline-item-title-wrapper > .text-block') as HTMLElement;
            if (descriptionElement) descriptionElement.innerText = section.description || "";
            
            header.addEventListener('click', () => this.toggle_show(header));
            orderElement.innerText = (index + 1).toString();
            titleElement.innerText = section.heading || "";
            
            const videoList = content.querySelector(this.config.videoListClass) as HTMLElement;

            section.lessons.forEach((vi: any, j: number) => {
                const video = content.querySelector(this.config.videoItemClass).cloneNode(true) as HTMLElement;
                this.renderVideo(video, vi, vi.preview);
                if (j === 0) videoList.innerHTML = "";
                videoList.append(video);
            });
            
            if (index === 0) {
                this.outline_container.innerHTML = "";
            }
            this.outline_container.append(content);
        });
    }
}

export class CourseOutline extends Course {
    constructor(outline_id: string, content_id: string) {
        super(outline_id, content_id);
        this.config = {
            headerClass: '.course-outline-item-header-learning',
            orderClass: '.course-outline-item-order-learning',
            titleClass: '.course-learning-item-title',
            videoListClass: '.video-item-list-learning',
            videoItemClass: '.video-item-learning',
            videoNameClass: '.video-name-learning'
        };
        
        const intro = document.getElementById('course-intro');
        if (intro) {
            intro.addEventListener('click', async () => {
                const introLink = intro.getAttribute('data-intro-link');
                if (introLink) {
                    const embedCode = await get_embed_code(introLink);
                    document.getElementById("course-video-container").innerHTML = embedCode.outerHTML;
                    document.querySelectorAll(".current").forEach(el => el.classList.remove("current"));
                    intro.classList.toggle("current");
                }
            });
        } else {
            this.init_first_lesson = true;
        }
    }

    protected renderVideo(video: HTMLElement, vi: any): void {
        const name = video.querySelector(this.config.videoNameClass) as HTMLElement;
        name.innerText = vi.title || "";
        const imgIcon = video.querySelector('img') as HTMLImageElement;
        imgIcon.src = vi.type === "application/pdf" ? Icon.pdf : Icon.video;

        video.addEventListener("click", async function() {
            const type = vi.type || 'video';
            
            if (mobileAndTabletCheck() && screenAspectRatio() <= 1.5) {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                if (type === "application/pdf") window.open(vi.url);
            }

            const embed_code = type === "application/pdf" 
                ? `<object data="${vi.url}" type="application/pdf" width="100%" height="100%"></object>` 
                : await get_embed_code(vi.url);
            
            document.getElementById("course-video-container").innerHTML = embed_code instanceof HTMLElement ? embed_code.outerHTML : embed_code;
            document.querySelectorAll(".current").forEach(el => el.classList.remove("current"));
            this.classList.toggle("current");
        });
    }
}