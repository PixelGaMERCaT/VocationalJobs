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
	$("#reload-button").html("<button disabled>Loading...</button>");

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
		console.log(response);
		var dbInfo = JSON.parse(response);
		console.log(dbInfo);
		$(".db-info").remove();
		for (var i = 0; i < dbInfo.length; i++) {
			//console.log(dbInfo[i]);
			
			var today = new Date();
			var birthDate = new Date(dbInfo[i].dob);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}

			$("#dbTable").append("<tr class='db-info'><td>" +
			dbInfo[i].username + "</td><td>" +
			dbInfo[i].tag + "</td><td>" +
			dbInfo[i].firstName + "</td><td>" +
			dbInfo[i].lastName + "</td><td>" +
			dbInfo[i].dob + "</td><td>" +
			age + "</td><td>" +
			dbInfo[i].study + "</td><td>" +
			dbInfo[i].email + "</td><td>" +
			dbInfo[i].location + "</td><td>" +
			dbInfo[i].admin + "</td><td><button onclick='removeUser(\"" + dbInfo[i].username + "\", \"" + dbInfo[i].tag + "\")'>X</button></tr>");
		}
		$("#reload-button").html("<button id='reload-button' onclick='showDatabase()'>Show Database</button>");

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
  	$.ajax(settings);
}

function generateRandomUser() {
	var tag = ((Math.random() * 9999) + 1).toFixed(0).toString();
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "/api/makeUser?tag=" + tag + "&username=OwOuWu&firstName=Random&lastName=User&dob=2000-1-01&email=random.user%40example.com&location=Existing, Location&study=Multi-Variable Vector Analysis&admin=0",
		"method": "GET",
		"headers": {
		"cache-control": "no-cache",
		}
  	}	
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
	$.ajax(settings);
}