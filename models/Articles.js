var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articlesSchema = new Schema({
  title: {
    type: String
  },
  date: {
    type: Date
  },
  url: String
});

var Article = mongoose.model("History", articlesSchema);
module.exports = Article;
