function getUser(username) {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/getUser?username=" + username,
		"method": "GET",
		"headers": {
		"cache-control": "no-cache",
		}
	}
	
  	$.ajax(settings).done(function (response) {
		console.log(response);
	});
}

function showDatabase() {
	$(".db-info").remove();

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/getDB",
		"method": "GET",
		"headers": {
			"cache-control": "no-cache",
		}
	}
	
  	$.ajax(settings).done(function (response) {
		var dbInfo = JSON.parse(response);
		console.log(dbInfo);
		for (var i = 0; i < dbInfo.length; i++) {
			//console.log(dbInfo[i]);
			$("#dbTable").append("<tr class='db-info'><td>" +
			dbInfo[i].username + "</td><td>" +
			dbInfo[i].tag + "</td><td>" +
			dbInfo[i].name + "</td><td>" +
			dbInfo[i].name + "</td><td>" +
			dbInfo[i].age + "</td><td>" +
			dbInfo[i].study + "</td><td>" +
			dbInfo[i].email + "</td><td>" +
			dbInfo[i].location + "</td><td><button onclick='removeUser(\"" + dbInfo[i].username + "\", \"" + dbInfo[i].tag + "\")'>X</button></tr>");
		}
	});
}

function makeUser() {
	var tag = ((Math.random() * 9999) + 1).toFixed(0).toString();
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/makeUser?tag=" + tag + "&" + $("#makeUser").serialize(),
		"method": "GET",
		"headers": {
		"cache-control": "no-cache",
		}
  }
  //console.log(settings);
	
  $.ajax(settings);
}

function removeUser(username, tag) {
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/removeUser?username=" + username + "&tag=" + tag,
		"method": "GET",
		"headers": {
		"cache-control": "no-cache",
		}
	}
	console.log(settings);

	$.ajax(settings);
}