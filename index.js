// Install body-parser and Express
const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const formidable = require('formidable');
const md5File = require('md5-file');
const fs = require('fs');
const bCrypt = require('bcrypt');
const crypto = require('crypto');


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

app.get('/loadProfile.js', (req, res) => {
	res.sendFile(__dirname + "/pages/public/loadProfile.js")
});
app.get('/database.js', (req, res) => {
	res.sendFile(__dirname + "/pages/public/database.js")
});

app.get('/api/getUser', (req, res) => {
	mongoClient.connect(mongoUrl, function (err, db) {
		if (err) throw err;
		var dbo = db.db("apps4rva");
		dbo.collection("users").findOne({ username: req.query.username, tag: req.query.tag }, function (err, result) {
			if (err) throw err;
			res.end(JSON.stringify(result));
			db.close();
		});
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
		dbo.collection('users').insertOne({ username: req.query.username, tag: req.query.tag, firstName: req.query.firstName, lastName: req.query.lastName, dob: req.query.dob, email: req.query.email, location: req.query.location, study: req.query.study, admin: req.query.admin }, function (err, db) {
			if (err) throw err;
		});
	});
});

app.get('/api/removeUser', (req, res) => {
	mongoClient.connect(mongoUrl, function (err, db) {
		if (err) throw err;
		var dbo = db.db('apps4rva');
		console.log({ username: req.query.username, tag: req.query.tag });
		dbo.collection('users').deleteOne({ username: req.query.username, tag: parseInt(req.query.tag) }, function (err, db) {
			if (err) throw err;
		});
	});
});

app.post('/api/upload', (req, res) => {
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
					res.sendFile(filePath);
				});
			});
		});
});

app.post('/api/makeUser', (req, res) => {
	var form = new formidable.IncomingForm();
	var userData = { "admin": 0, "pfp": __dirname + "/pages/public/user-placeholder.svg", "certs": null };
	form.parse(req)
		.on('field', function (name, value) {
			userData[name] = value;
		})
		.on('end', function () {
			register(userData);
			res.sendFile(__dirname + "/pages/profile.html");
		})
});

app.post('/api/login', (req, res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields) => {
		console.log(fields);
		if (err) throw err;
		console.log(fields);
		login(fields["email"], fields["password"]).then((h) => {
			res.send(h);
			console.log(h);
		});
	})
})

async function login(email, password) {
	return new Promise((resolve, reject) => {
		mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, db) {
			if (err) throw err;
			var dbo = db.db("apps4rva");
			dbo.collection("users").findOne({ email: email }).then(function(json) {
				bCrypt.compare(password, json["password"], (err, result) => {
					if (err) throw err;
					if (result) {
						var token = crypto.randomBytes(32).toString('hex');
						dbo.collection("users").updateOne({ _id: json["_id"] }, { $set: { token: token } });
						resolve({ status: "logged in", uid: json["uid"], token: token });
					} else {
						resolve({ status: "incorrect username or password" });
					}
				})
			})
		})
	});
}

async function register(userData) {
	return new Promise((resolve, reject) => {
		mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, db) {
			if (err) throw err;
			var dbo = db.db("apps4rva");
			dbo.collection("users").find({ username: userData["username"] }).project({ _id: 0, tag: 1 }).toArray().then((json) => {
				var tag = Math.floor((Math.random() * 9999) + 1);
				var tagExists = true;
				if (json.length >= 9999) {
					reject(new Error("Username full!"))
				} else {
					while (tagExists) {
						console.log(json.values());
						console.log(tag);
						tagExists = false;
						for (let elements of json.values()) {
							if (elements["tag"] == tag) tagExists = true;
						}
					}
					userData["tag"] = tag;
					userData["uid"] = crypto.randomBytes(32).toString('hex');
					console.log(userData);
					bCrypt.hash(userData["password"], 10, (err, hash) => {
						if (err) throw err;
						userData["password"] = hash;
						dbo.collection("users").insertOne(userData);
						dbo.collection("users").findOne({username: "tset"}).then((json) => {
							console.log(json["password"]);
						});
						resolve("User created!");
					});
				}
			});
		})
	})
}

app.get('/api/test', (req, res) => {
	bCrypt.compare('aw', test, (err, result) => {
		if (err) throw err;
		console.log(result);
	})
});





app.listen(3000, () => console.log('App listening on port 3000!'));