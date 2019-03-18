

function getUser(username) {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/test?username=" + username,
		"method": "GET",
		"headers": {
		"cache-control": "no-cache",
		}
	}
	
  	$.ajax(settings).done(function (response) {
		console.log(response);
	});
}