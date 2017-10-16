const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  title: String,
  date: String,
  fromEvent: mongoose.Schema.ObjectId;
  text: String,
  numUsers: Number
});

const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
