var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/api/getUser?username=PixelGaMERCaT&tag=213",
    "method": "GET",
    "headers": {
    "cache-control": "no-cache",
    }
}

$.ajax(settings).done(function (response) {
    var dbInfo = JSON.parse(response);

    var today = new Date();
    var birthDate = new Date(dbInfo.dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    $("#user-info").html("<h6 id=\"info-headers\">Name</h6><p id=\"name\">" + dbInfo.firstName + " " + dbInfo.lastName + "</p><h6 id=\"info-headers\">Age</h6><p id=\"age\">" + age + "</p><h6 id=\"info-headers\">Email Address</h6><a href=\"mailto:" + dbInfo.email + "\">"+ dbInfo.email + "</a><br><h6 id=\"info-headers\">Location</h6><p>" + dbInfo.location + "</p><h6 id=\"info-headers\">Field of Study</h6><p>" + dbInfo.study + "</p>");
});