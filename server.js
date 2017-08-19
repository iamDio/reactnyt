
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();
const port = process.env.port || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

//------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
mongoose.connect("mongodb://localhost/reactnyt");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application

app.get("/", function(req,res){
	res.sendFile(__dirname+ "/public/index.html");
})


// This is the route we will send GET requests to retrieve our most recent search data.
// We will call this route the moment our page gets rendered
//app.get("/api", function(req, res) {})

//app.post("/api", function(req, res){})

app.listen(port, function(){
	console.log(`app listening on port ${port}`)
});