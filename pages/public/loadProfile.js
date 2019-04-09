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
    $("#pfp").html("<img id='user-image' class='center' src='/api/pfp?name=" + dbInfo.pfp + "'>");
    $("#user-data").html("<h6 id=\"info-headers\">Name</h6><p id=\"name\">" + dbInfo.firstName + " " + dbInfo.lastName + "</p><h6 id=\"info-headers\">Age</h6><p id=\"age\">" + age + "</p><h6 id=\"info-headers\">Email Address</h6><a href=\"mailto:" + dbInfo.email + "\">" + dbInfo.email + "</a><br><br><h6 id=\"info-headers\">Location</h6><p>" + dbInfo.location + "</p><h6 id=\"info-headers\">Field of Study</h6><p>" + dbInfo.study + "</p></div>");

    var html = "";
    var remaining = dbInfo.certs.length;
    console.log(Math.ceil(remaining/4));
    for (var i = 0; i <= Math.ceil(remaining / 4); i++) {
        html += "<div class='row'>";
        var cols = 0;
        if (remaining >= 4) {cols = 4;}
        else {cols = remaining;}
        for (var j = 0; j < cols; j++) {
            console.log(i,j);
            html += `<div class="cert col-md-3">
            <img class="cert-img" placeholder="a certification" src="/api/pfp?name=` + dbInfo.certs[i*4+j] + `">
        </div>
        `
        }
        html += "</div>";
        remaining -= 4;
    }
    $("#certs").append(html);
});