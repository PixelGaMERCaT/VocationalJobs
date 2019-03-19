var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/api/getUser?username=PixelGaMERCaT&tag=420",
    "method": "GET",
    "headers": {
    "cache-control": "no-cache",
    }
}

$.ajax(settings).done(function (response) {
    var dbInfo = JSON.parse(response);
    let name = dbInfo.name;
    
    $("#user-info").html("<h6 id=\"info-headers\">Name</h6><p id=\"name\">" + dbInfo.name + "</p><h6 id=\"info-headers\">Age</h6><p id=\"age\">" + dbInfo.age + "</p><h6 id=\"info-headers\">Email Address</h6><a href=\"mailto:" + dbInfo.email + "\">"+ dbInfo.email + "</a><br><h6 id=\"info-headers\">Location</h6><p>" + dbInfo.location + "</p><h6 id=\"info-headers\">Field of Study</h6><p>" + dbInfo.study + "</p>");
});