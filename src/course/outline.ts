import { CF_URL, Icon } from '../consts'
import { mobileAndTabletCheck, screenAspectRatio } from '../utils'
import MicroModal from 'micromodal';

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (e) {
        console.error('Invalid URL:', url);
        return false;
    }
}

async function get_embed_code(url: string): Promise<HTMLIFrameElement> {
    if (!isValidUrl(url)) throw new Error('Invalid URL provided');

    const _url = new URL(url);
    const domain = _url.hostname;
    let embed_code: string;

    switch (domain) {
        case 'www.youtube.com':
        case 'youtube.com':
        case 'youtu.be':
            const response = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            embed_code = (await response.json()).html;
            break;
        case 'vimeo.com':
            const response2 = await fetch(`https://vimeo.com/api/oembed.json?url=${url}`);
            if (!response2.ok) throw new Error(`HTTP error! status: ${response2.status}`);
            embed_code = (await response2.json()).html;
            break;
        default:
            embed_code = `<iframe src='${url}?rel=0&controls=1&autoplay=0&mute=0&start=0' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen=''></iframe>`;
    }

    const parser = new DOMParser();
    const code = parser.parseFromString(embed_code, 'text/html').documentElement as HTMLIFrameElement;
    Object.assign(code.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'auto'
    });
    return code;
}

async function setModalEmbedCode(modal_id: string, url: string) {
    const embedCode = await get_embed_code(url);
    const previewElement = document.querySelector(`#${modal_id} .preview-lesson`);
    if (previewElement) previewElement.innerHTML = embedCode.outerHTML;
}

export class Course {
    protected course_content: HTMLElement;
    protected outline_container: HTMLElement;
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
            this.render(outline);
            if (this.init_first_lesson && outline.length > 0) {
                const player = document.getElementById('course-video-container');
                if (player) {
                    const firstLesson = outline[0].lessons.find(lesson => isValidUrl(lesson.url));
                    if (firstLesson) {
                        player.innerHTML = (await get_embed_code(firstLesson.url)).outerHTML;
                    }
                }
            }
        }).catch(error => console.error('Error rendering outline:', error));
    }

    get_outline(slug: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!slug.startsWith('/')) {
                const course_outline = document.getElementById(slug);
                const outline_ = course_outline.querySelector('script').getAttribute('outline');
                course_outline.remove();
                resolve(JSON.parse(outline_));
            } else {
                fetch(`${CF_URL}${slug}.json`, { method: 'GET', cache: 'force-cache' })
                    .then(response => response.json())
                    .then(resolve)
                    .catch(error => reject(`Error fetching outline data: ${error}`));
            }
        });
    }

    toggle_show(e: HTMLElement) {
        const parent = e.parentNode as HTMLElement;
        const content = e.nextElementSibling as HTMLElement;
        parent.classList.toggle('show');
        content.classList.toggle('show');
        content.style.height = content.classList.contains('show') ? content.scrollHeight + 'px' : '0';
    }

    protected renderVideo(video: HTMLElement, vi: any, isPreview = false): void {
        const name = video.querySelector(this.config.videoNameClass) as HTMLElement;
        name.classList.toggle('link-span', false);
        name.classList.toggle('link-disabled', true);
        const imgIcon = video.querySelector('img') as HTMLImageElement;
        
        name.innerText = vi.title || '';
        imgIcon.src = vi.type === 'application/pdf' ? Icon.pdf : Icon.video;

        const hasValidUrl = vi.url && isValidUrl(vi.url);
        if (!hasValidUrl) {
            return;
        }

        if (vi.type === 'application/pdf') {
            const length = video.querySelector('.video-length') as HTMLElement;
            if (length) length.style.display = 'none';
        } else if (isPreview) {
            name.classList.toggle('link-disabled', false);
            name.classList.toggle('link-span', true);
            video.addEventListener('click', () => {
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

            header.addEventListener('click', () => this.toggle_show(header));
            orderElement.innerText = (index + 1).toString();
            titleElement.innerText = section.heading || '';
            if (descriptionElement) descriptionElement.innerText = section.description || '';

            const videoList = content.querySelector(this.config.videoListClass) as HTMLElement;
            section.lessons.forEach((vi: any, j: number) => {
                const video = content.querySelector(this.config.videoItemClass).cloneNode(true) as HTMLElement;
                this.renderVideo(video, vi, vi.preview);
                if (j === 0) videoList.innerHTML = '';
                videoList.append(video);
            });

            if (index === 0) this.outline_container.innerHTML = '';
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
        const imgIcon = video.querySelector('img') as HTMLImageElement;
        
        name.innerText = vi.title || "";
        imgIcon.src = vi.type === "application/pdf" ? Icon.pdf : Icon.video;

        const hasValidUrl = vi.url && isValidUrl(vi.url);
        name.classList.toggle('link-disabled', !hasValidUrl);
        name.classList.toggle('link-span', hasValidUrl);
        
        if (!hasValidUrl) return;

        video.addEventListener("click", async function () {
            const type = vi.type || 'video';

            if (mobileAndTabletCheck() && screenAspectRatio() >= 1.5) {
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