// Install body-parser and Express
const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://192.168.1.193:27017/";
var bodyParser = require('body-parser');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

var settings = {
	"async": true,
	"crossDomain": true,
	"url": "/api/test?username=pixel",
	"method": "GET",
	"headers": {
	  "cache-control": "no-cache",
	  "Postman-Token": "2787ee09-af72-4dc1-a7f9-2a0997f6223c"
	}
  }
  
  $.ajax(settings).done(function (response) {
	console.log(response);
  });

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
app.get('/testScript.js', (req, res) => {
	res.sendFile(__dirname + "/pages/testScript.js")});
app.get('/index.js', (req, res) => {
	res.sendFile(__dirname + "/index.js")});
app.get('/api/test', (req, res) => {
	mongoClient.connect(mongoUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("apps4rvaTest");
		dbo.collection("users").findOne({user: req.query.username}, function(err, result) {
			if (err) throw err;
			res.end(JSON.stringify(result))
			db.close();
			});
		}
	);
})

app.listen(3000, () => console.log('App listening on port 3000!'));

