// Google Apps Script to call Vimeo API and extract video links and titles from a playlist URL
var scriptProperties = PropertiesService.getScriptProperties();
var accessToken = scriptProperties.getProperty('Key')
var myID = scriptProperties.getProperty('ME')


Logger.log(getVimeoVideos("16127951"))

function getVimeoVideos(projectID) {
	if (!(accessToken && projectID)) throw new Error("Missing required parameters");
	// Make a GET request to the Vimeo API
	var apiUrl = "https://api.vimeo.com/users/" + myID + "/projects/" + projectID + "/items";
	var options = {
		method: "GET",
		redirect: "follow",
		headers: {
			"Authorization": "Bearer " + accessToken,
			"Content-Type": "application/json"
		}
	};
	var response = UrlFetchApp.fetch(apiUrl, options);
	var data = JSON.parse(response.getContentText());

	// Extract video links and titles
	var videos = [];
	for (var i = 0; i < data.data.length; i++) {
		var pk, title = parse_name(data.data[i].video.name) 
		var video = {
			pk: pk,
			url: data.data[i].video.link,
			title: title,
			description: data.data[i].video.description,
			duration: get_duration(data.data[i].video.duration)
		};
		videos.push(video);
	}
	// Return the array of video links and titles
	JSON.stringify(videos.sort((a, b) => parseFloat(a.pk) - parseFloat(b.pk)));
	
	return ;
}

function get_duration(seconds) {
	return new Date(seconds * 1000).toISOString().slice(14, 19);
}

function parse_name(str) {
	const regex = /((Bài|Buổi)\s)?(\d+)(( - )|(: ))(.*)/;
	const match = str.match(regex);
	if (match) {
		const extractedNumber = parseInt(match[3], 10);
		const extractedString = match[6];
		return [extractedNumber, extractedString]
	} else {
		return ["", str];
	}
}

function videos2outline(videos) {
	
	// Group videos by description
	const groupedVideos = videos.reduce((acc, video) => {
		const description = video.description;
		if (!acc[description]) {
			acc[description] = [];
		}
		acc[description].push({
		title: `Bài 1: Massage Guasha nhanh cho người mới bắt đầu`,
		url: video.link,
		duration: video.duration,
		});
		return acc;
	}, {});
	const sections = Object.keys(groupedVideos).map((description) => ({
		heading: description,
		description: "Weekly LLD Meeting", // You can customize this if needed
		lessons: groupedVideos[description],
	  }));

	return JSON.stringify({ sections }, null, 2);
}
