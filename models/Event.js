const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  time: String,
  location: String,
  volunteers: Array,
  training: Array
}, {timestamps: true});

const Events = mongoose.model('Events', eventSchema);

module.exports = Events;
