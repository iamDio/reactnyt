
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

const app = express();
const port = process.env.port || 3000;
//-------------------------------------------------
//set up cheerio

// First, tell the console what server3.js is doing
console.log("\n******************************************\n" +
            "Look at the link of every article \n" +
            "on the nyt.com website \n" +
            "grab the url, title, and author." +
            "\n******************************************\n");

// Make request to grab the HTML from awwards's clean website section
request("http://query.nytimes.com/", function(error, response, html) {

  // Load the HTML into cheerio
  var $ = cheerio.load(html);

  // Make an empty array for saving our scraped info
  var results = [];

  // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
  $("figure.site").each(function(i, element) {

    /* Cheerio's find method will "find" the first matching child element in a parent.
     *    We start at the current element, then "find" its first child a-tag.
     *    Then, we "find" the lone child img-tag in that a-tag.
     *    Then, .attr grabs the imgs src value.
     * So: <figure>  ->  <a>  ->  <img src="link">  ->  "link"  */
    var imgLink = $(element).find("a").find("img").attr("src");

    // Push the image's URL (saved to the imgLink var) into the results array
    results.push({ link: imgLink });
  });

  // After looping through each element found, log the results to the console
  console.log(results);
});


//-------------------------------------------------

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