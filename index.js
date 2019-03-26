// Install body-parser and Express
const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const formidable = require('formidable');
const md5File = require('md5-file');
const fs = require('fs');

var mongoUrl = "mongodb://localhost:27017/";
var bodyParser = require('body-parser');

// Use req.query to read values!!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("pages/public"));

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/pages/index.html")});
app.get('/certifications', (req, res) => {
	res.sendFile(__dirname + "/pages/certifications.html")});
app.get('/profile', (req, res) => {
	res.sendFile(__dirname + "/pages/profile.html")});
app.get('/edit_profile', (req, res) => {
	res.sendFile(__dirname + "/pages/edit_profile.html")});
app.get('/admin.html', (req, res) => {
	res.sendFile(__dirname + "/pages/admin.html")});
app.get('/sign_in', (req, res) => {
	res.sendFile(__dirname + "/pages/sign_in.html")});
app.get('/sign_up', (req, res) => {
	res.sendFile(__dirname + "/pages/sign_up.html")});

app.get('/loadProfile.js', (req, res) => {
	res.sendFile(__dirname + "/pages/public/loadProfile.js")});
app.get('/database.js', (req, res) => {
	res.sendFile(__dirname + "/pages/public/database.js")});

app.get('/api/getUser', (req, res) => {
	mongoClient.connect(mongoUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("apps4rva");
		dbo.collection("users").findOne({username: req.query.username, tag: req.query.tag}, function(err, result) {
			if (err) throw err;
			res.end(JSON.stringify(result));
			db.close();
		});
	});
})

app.get('/api/getDB', (req, res) => {
	mongoClient.connect(mongoUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db('apps4rva');
		dbo.collection('users').find({}).toArray(function(err, result) {
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
		dbo.collection('users').insertOne({username: req.query.username, tag: req.query.tag, firstName:req.query.firstName, lastName:req.query.lastName, dob: req.query.dob, email:req.query.email, location:req.query.location, study:req.query.study, admin:req.query.admin}, function (err, db) {
			if (err) throw err;
		});
	});
});

app.get('/api/removeUser', (req, res) => {
	mongoClient.connect(mongoUrl, function (err, db) {
		if (err) throw err;
		var dbo = db.db('apps4rva');
		console.log({username: req.query.username, tag: req.query.tag});
		dbo.collection('users').deleteOne({username: req.query.username, tag: req.query.tag}, function (err, db) {
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
	var userData = {"admin": 0, "tag": ((Math.random() * 9999) + 1).toFixed(0).toString(), "pfp":null, "certs":null};
	form.parse(req)
		.on('field', function(name, value) {
			userData[name] = value;
		})
		.on('end', function() {
			mongoClient.connect(mongoUrl, function(err, db) {
				if (err) throw err;
				console.log(userData);
				var dbo = db.db('apps4rva');
				dbo.collection('users').insertOne(userData, function(err) {
					if (err) throw err;
				});
			});
			res.sendFile(__dirname + "/pages/profile.html");
		})
});

app.listen(3000, () => console.log('App listening on port 3000!'));

