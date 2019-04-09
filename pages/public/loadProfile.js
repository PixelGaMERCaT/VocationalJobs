var settings = {
    "url": "/api/getUser?uid=" + localStorage.getItem("uid"),
    "method": "GET"
}

$.ajax(settings).done(function (response) {
    console.log(response);
    var dbInfo = response; //JSON.parse(response);

    var today = new Date();
    var birthDate = new Date(dbInfo.dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    $("#pfpSmall").replaceWith("<img id='user-image-small' src='/api/pfp?name=" + dbInfo.pfp + "'>");
    $("#pfp").html("<img id='user-image' src='/api/pfp?name=" + dbInfo.pfp + "'><div id='user-info'><h6 id=\"info-headers\">Name</h6><p id=\"name\">" + dbInfo.firstName + " " + dbInfo.lastName + "</p><h6 id=\"info-headers\">Age</h6><p id=\"age\">" + age + "</p><h6 id=\"info-headers\">Email Address</h6><a href=\"mailto:" + dbInfo.email + "\">"+ dbInfo.email + "</a><br><br><h6 id=\"info-headers\">Location</h6><p>" + dbInfo.location + "</p><h6 id=\"info-headers\">Field of Study</h6><p>" + dbInfo.study + "</p></div>");
});