// Google Apps Script to call Vimeo API and extract video links and titles from a playlist URL
var scriptProperties = PropertiesService.getScriptProperties();
var accessToken = scriptProperties.getProperty('Key')
var myID = scriptProperties.getProperty('ME')

function getVimeoVideos(projectID) {
	if (!(accessToken && projectID)) throw new Error("Missing required parameters")

	function parse_name(str) {
		const regex = /((Bài|Buổi)\s)?(\d+)(( - )|(: ))(.*)/;
		const match = str.match(regex);
		if (match) {
			const extractedNumber = parseInt(match[3], 10);
			const extractedString = match[6];
			return [extractedNumber, extractedString]
		} else return ["", str];
	}

	const options = {
		method: "GET",
		redirect: "follow",
		headers: {
			"Authorization": `Bearer ${accessToken}`,
			"Content-Type": "application/json"
		}
	};
	// Get folder name
	var data = JSON.parse(
		UrlFetchApp.fetch(
			`https://api.vimeo.com/users/${myID}/projects/${projectID}`,
			options
		).getContentText()
	)
	const folder_name = data.name;

	function videos2outline(videos) {
		// Group videos by description
		const groupedVideos = videos.reduce((acc, video) => {
			const description = video.description || folder_name
			if (!acc[description]) acc[description] = [];
			acc[description].push({
				title: video.title,
				url: video.url,
				duration: video.duration,
			});
			return acc;
		}, {});

		const sections = Object.keys(groupedVideos).map((description) => ({
			heading: description.split(" - ")[0] || folder_name,
			description: description.split(" - ")[1] || '', // You can customize this if needed
			lessons: groupedVideos[description],
		}));

		return JSON.stringify(sections, null, 2);
	}
	// Make a GET request to the Vimeo API
	apiUrl = `https://api.vimeo.com/users/${myID}/projects/${projectID}/videos`
	const response = UrlFetchApp.fetch(apiUrl, options)
	data = JSON.parse(response.getContentText())

	// Extract video links and titles
	const videos = [];
	for (const item of data.data) {
		const name = parse_name(item.name)
		const pk = name[0]
		const title = name[1]
		const video = {
			pk,
			url: item.link,
			title,
			description: item.description,
			duration: get_duration(item.duration)
		}
		videos.push(video)
	}
	// Return the array of video links and titles
	const videos_ = videos.sort((a, b) => parseFloat(a.pk) - parseFloat(b.pk));

	return `document.currentScript.setAttribute("outline", JSON.stringify(${videos2outline(videos_)}))`;
}

function get_duration(seconds) {
	return new Date(seconds * 1000).toISOString().slice(14, 19);
}
