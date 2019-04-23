// Install body-parser and Express
const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const formidable = require('formidable');
const md5File = require('md5-file');
const fs = require('fs');
const bCrypt = require('bcrypt');
const crypto = require('crypto');
const jimp = require('jimp');


var mongoUrl = "mongodb://localhost:27017/";
var bodyParser = require('body-parser');

// Use req.query to read values!!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("pages/public"));

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/pages/index.html")
});
app.get('/certifications', (req, res) => {
	res.sendFile(__dirname + "/pages/certifications.html")
});
app.get('/profile', (req, res) => {
	res.sendFile(__dirname + "/pages/profile.html")
});
app.get('/edit_profile', (req, res) => {
	res.sendFile(__dirname + "/pages/edit_profile.html")
});
app.get('/admin.html', (req, res) => {
	res.sendFile(__dirname + "/pages/admin.html")
});
app.get('/sign_in', (req, res) => {
	res.sendFile(__dirname + "/pages/sign_in.html")
});
app.get('/sign_up', (req, res) => {
	res.sendFile(__dirname + "/pages/sign_up.html")
});
app.get('/test', (req, res) => {
	res.sendFile(__dirname + "/pages/test.html")
});
app.get('/course/:course', (req, res) => {
	res.sendFile(__dirname + "/pages/course_template.html")
});
app.get('/dataInput', (req, res) => {
	res.sendFile(__dirname + "/pages/dataInput.html");
});

app.get('/loadProfile.js', (req, res) => {
	res.sendFile(__dirname + "/pages/public/loadProfile.js")
});
app.get('/database.js', (req, res) => {
	res.sendFile(__dirname + "/pages/public/database.js")
});
app.get('/logo', (req, res) => {
	res.sendFile(__dirname + "/pages/public/logo.png")
});
app.get('/courses.json', (req, res) => {
	res.sendFile(__dirname + "/pages/public/courses.json");
})

app.get('/api/getUser', (req, res) => {
	mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("apps4rva");
		dbo.collection("users").findOne({ uid: req.query.uid }, function (err, result) {
			if (err) throw err;
			res.send(result);
			db.close();
		});
	});
})

app.get('/courses/:course', (req, res) => {
	fs.readFile("courses.json", (err, json) => {
		var courses = JSON.parse(json);
		var course = courses.find(obj => {
			return obj.jobID == req.params.course;
		})
		if (course == undefined) {
			res.send('404');
		} else {
			res.sendFile(__dirname + '/pages/course_template.html');
		}
	});
})

app.get('/courses/:course/data', (req, res) => {
	fs.readFile("courses.json", (err, json) => {
		var courses = JSON.parse(json);
		var course = courses.find(obj => {
			return obj.jobID == req.params.course;
		})
		if (course == undefined) {
			res.send('404');
		} else {
			res.send(course);
		}
	});
})

app.get('/api/getDB', (req, res) => {
	mongoClient.connect(mongoUrl, function (err, db) {
		if (err) throw err;
		var dbo = db.db('apps4rva');
		dbo.collection('users').find({}).toArray(function (err, result) {
			if (err) throw err;
			res.end(JSON.stringify(result));
			db.close();
		});
	});
});

app.get('/api/makeUser', (req, res) => {
	mongoClient.connect(mongoUrl, function (err, db) {
		if (err) throw err;
		var dbo = db.db('apps4rva');
		dbo.collection('users').insertOne({tag: req.query.tag, firstName: req.query.firstName, lastName: req.query.lastName, dob: req.query.dob, email: req.query.email, location: req.query.location, study: req.query.study, admin: req.query.admin }, function (err, db) {
			if (err) throw err;
		});
	});
});

app.get('/api/removeUser', (req, res) => {
	mongoClient.connect(mongoUrl, function (err, db) {
		if (err) throw err;
		var dbo = db.db('apps4rva');
		dbo.collection('users').deleteOne({ email: req.query.email, tag: parseInt(req.query.tag) }, function (err, db) {
			if (err) throw err;
		});
	});
});

// app.post('/dataInput', (req, res) => {
// 	var data = {}
// 	var form = new formidable.IncomingForm();
// 	form.parse(req)
// 		.on('field', (name, value) => {
// 			data[name] = value;
// 		})
// 		.on('end', () => {
// 			fs.appendFile(__dirname + "/courses.json", JSON.stringify(data) + ",\n\t", (err) => {
// 				if (err) throw err;
// 			})
// 		});
// });

app.post('/api/upload/cert', (req, res) => {
	var uid;
	var files = [];
	var form = new formidable.IncomingForm();
	try {
		form.parse(req)
			.on('fileBegin', (name, file) => {
				console.log("a file has appeared!")
				file.path = __dirname + "/temp/" + file.name;
			})
			.on('file', (name, file) => {
				md5File(file.path, (err, hash) => {
					if (err) throw err;
					jimp.read(file.path, (err, lenna) => {
						try {
							lenna.quality(60).write(__dirname + "/uploads/" + hash + ".jpg");
							files.push(hash + ".jpg");
						} catch {

						}
					})
				})
			})
			.on('field', (name, value) => {
				console.log(name, value);
				uid = value;
			})
			.on('end', () => {
				mongoClient.connect(mongoUrl, (err, db) => {
					if (err) throw err;
					var dbo = db.db("apps4rva");
					dbo.collection("users").findOne({ uid: uid }).then((json) => {
						var newList = [...new Set(files.concat(json.certs))];

						if (json["certs"]) {
							dbo.collection("users").updateOne({ uid: uid }, { $set: { certs: newList } });
						} else {
							dbo.collection("users").updateOne({ uid: uid }, { $set: { certs: files } });
						}
						res.send("success");
					})
				})
			})
	} catch {}
})

app.post('/edit_profile', (req, res) => {
	var userData = {};
	var pathToDelete;
	var form = new formidable.IncomingForm();
	form.parse(req)
		.on('fileBegin', (name, file) => {
			if (file.name != "") {
				file.path = __dirname + "/temp/" + file.name;
				pathToDelete = file.path;
			}
		})
		.on('file', (name, file) => {
			if (file.name != "") {
				md5File(file.path, (err, hash) => {
					jimp.read(file.path, (err, lenna) => {
						if (err) throw err;
						var path = __dirname + "/uploads/" + hash + ".jpg";
						lenna
							.resize(512, 512)
							.quality(60)
							.write(path);
						userData["pfp"] = hash + ".jpg";
						fs.unlinkSync(pathToDelete);
					})
				})
			}
		})
		.on('field', (name, value) => {
			userData[name] = value;
		})
		.on('end', () => {
			mongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
				if (err) throw err;
				var dbo = db.db("apps4rva");
				if (userData["pfp"] == undefined) dbo.collection("users").updateOne({ uid: userData["uid"] }, { $set: { firstName: userData["name"].split(" ")[0], lastName: userData["name"].split(" ")[1], dob: userData["dob"], email: userData["email"], location: userData["location"], study: userData["study"] } });
				else dbo.collection("users").updateOne({ uid: userData["uid"] }, { $set: { firstName: userData["name"].split(" ")[0], lastName: userData["name"].split(" ")[1], dob: userData["dob"], email: userData["email"], location: userData["location"], study: userData["study"], pfp: userData["pfp"] } });
				res.send("success");
			})
		});
})

app.get("/api/pfp", (req, res) => {
	res.sendFile(__dirname + "/uploads/" + req.query.name);
})

async function upload(req) {
	return new Promise((resolve, reject) => {
		var form = new formidable.IncomingForm();
		var filePath;
		form.parse(req)
			.on('fileBegin', (name, file) => {
				file.path = __dirname + "/uploads/" + file.name;
			})
			.on('file', (name, file) => {
				md5File(file.path, (err, hash) => {
					if (err) throw err;
					filePath = __dirname + "/uploads/" + hash + ".png";
					console.log(filePath);
					fs.rename(file.path, __dirname + "/uploads/" + hash + ".png", function (err) {
						if (err) throw err;
					});
				});
			});
	})
}

app.post('/api/make_user', (req, res) => {
	var form = new formidable.IncomingForm();
	var userData = { "admin": 0, "pfp": "user-placeholder.svg", "certs": null };
	form.parse(req)
		.on('field', function (name, value) {
			userData[name] = value;
		})
		.on('end', function () {
			register(userData);
			res.sendFile(__dirname + "/pages/sign_in.html");
		})
});

app.post('/api/login', (req, res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields) => {
		if (err) throw err;
		login(fields["email"], fields["password"]).then((h) => {
			res.send(h);
		});
	})
})

async function login(email, password) {
	return new Promise((resolve, reject) => {
		mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, db) {
			if (err) throw err;
			var dbo = db.db("apps4rva");
			dbo.collection("users").findOne({ email: email }).then(function (json) {
				if (json == null) {
					resolve({ status: "No user exists with that email." });
				} else {
					bCrypt.compare(password, json["password"], (err, result) => {
						if (err) throw err;
						if (result) {
							var token = crypto.randomBytes(32).toString('hex');
							dbo.collection("users").updateOne({ _id: json["_id"] }, { $set: { token: token } });
							resolve({ status: "logged in", uid: json["uid"], token: token });
						} else {
							resolve({ status: "Incorrect email or password." });
						}
					})
				}
			})
		})
	});
}

async function register(userData) {
	return new Promise((resolve, reject) => {
		mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, db) {
			if (err) throw err;
			var dbo = db.db("apps4rva");
			userData["uid"] = crypto.randomBytes(32).toString('hex');
			console.log(userData);
			bCrypt.hash(userData["password"], 10, (err, hash) => {
				if (err) throw err;
				userData["password"] = hash;
				dbo.collection("users").insertOne(userData);
				resolve("User created!");
			});
		})
	})
}

app.get('/api/test', (req, res) => {
	mongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
		if (err) throw err;
		var userData = { name: "Te st" };
		var dbo = db.db("apps4rva");
		dbo.collection("users").updateOne(
			{ uid: "8eb0440b44a35ada09876662f18363497aaea2fc43de3dac33f511c83440246d" },
			{
				$set:
				{
					firstName: userData["name"].split(" ")[0],
					lastName: userData["name"].split(" ")[1]
				}
			}
		)
		res.send('success');
	})
});

app.post('/api/test', (req, res) => {
	var userData = {};
	var form = new formidable.IncomingForm();
	form.parse(req)
		.on("file", (name, file) => {
			console.log(file.path);
			res.sendFile(file.path);
		})
		.on("end", () => {
			//res.send(userData);
		})
})

app.listen(3000, () => console.log('App listening on port 3000!'));