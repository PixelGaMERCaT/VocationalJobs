// Install body-parser and Express
const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
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

app.listen(3000, () => console.log('Example app listening on port 3000!'));

mongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db("apps4rvaTest");
	dbo.collection("users").findOne({user: "pixel"}, function(err, result) {
		if (err) throw err;
		console.log(result);
		db.close();
		});
	}
);
