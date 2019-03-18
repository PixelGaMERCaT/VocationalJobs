// Install body-parser and Express
const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;

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
app.get('/testScript.js', (req, res) => {
	res.sendFile(__dirname + "/pages/testScript.js")});
app.get('/database.js', (req, res) => {
	res.sendFile(__dirname + "/pages/database.js")});
app.get('/api/getUser', (req, res) => {
	mongoClient.connect(mongoUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("apps4rva");
		dbo.collection("users").findOne({username: req.query.username}, function(err, result) {
			if (err) throw err;
			res.end(JSON.stringify(result));
			db.close();
			});
		}
	);
})
app.listen(3000, () => console.log('App listening on port 3000!'));

