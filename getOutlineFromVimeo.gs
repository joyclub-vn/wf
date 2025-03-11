// Google Apps Script to call Vimeo API and extract video links and titles from a playlist URL
var scriptProperties = PropertiesService.getScriptProperties();
var accessToken = scriptProperties.getProperty('Key')
var myID = scriptProperties.getProperty('ME')

const url = 'https://api.vimeo.com'
const sregex = /(?<pk>\d+)(.? )(?<heading>.*)/;
const vregex = /(((?<pre>Bài|Buổi)\s+)?(?<pk>\d+)\s?(-|:|.)?\s?)?(?<name>.*)/;
const options = {
  method: "GET",
  redirect: "follow",
  headers: {
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  }
};
function _GET(api) {
  const response = UrlFetchApp.fetch(api, options)
  return JSON.parse(response.getContentText())
}
function getSections(id) {
  if (!(accessToken && id)) throw new Error("Missing required parameters")
  console.log(`GET Sections: ${id}`)
  let duration_time = 0
  let count_videos = 0
  const data = _GET(`${url}/users/${myID}/projects/${id}/items?per_page=100&sort=alphabetical`)
  const folders = []
  for (const item of data.data) {
    if (item.type == "folder") {
      const { pk, heading } = item.folder.name.match(sregex).groups;
      const api = url + item.folder.uri + '/items?per_page=100&sort=alphabetical'
      const { duration, lessons } = getLessons(api)
      count_videos += lessons ? parseFloat(lessons.length) : 0
      const folder = {
        pk,
        heading,
        description: "",
        lessons
      }
      folders.push(folder);
      duration_time += duration
      console.log(`${heading}: ${lessons.length} | ${duration}`)
    } else {
      // console.log(item)
    }
  }
  const _folders = JSON.stringify(folders.sort((a, b) => parseFloat(a.pk) - parseFloat(b.pk)))
  const HTML = `<script>document.currentScript.setAttribute("outline", JSON.stringify(${_folders}))</script>`
  return [[HTML, count_videos, get_duration(duration_time)]];
}
function getLessons(api) {
  console.log(`GET videos: ${api}`)
  const videos = []
  const data = _GET(api)
  let duration = 0
  for (const item of data.data) {
    if (item.type === 'video') {
      const { pre, pk, name } = item.video.name.match(vregex).groups;
      const title = (pre != null) ? `${pre} ${pk}: ${name}` : item.video.name
      const video = {
        pk,
        url: item.video.link,
        title,
        description: item.video.description,
        duration: get_duration(item.video.duration)
      }
      duration += item.video.duration
      // Check if any tag has "canonical": "preview"
      if (Array.isArray(item.video.tags) && item.video.tags.some(tag => tag.canonical === "preview")) {
          video.preview = true; // Set preview to true if the tag is found
      } else {
        console.log(item.video.tags)
      }
      videos.push(video)
    }
  }
  return { lessons: videos.sort((a, b) => parseFloat(a.pk) - parseFloat(b.pk)), duration };
}

function get_duration(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${hours ? pad(hours) + ':' : ''}${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
  return (number < 10 ? '0' : '') + number;
}
