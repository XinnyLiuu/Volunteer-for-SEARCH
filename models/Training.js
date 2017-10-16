const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  video: String;
  description: String;
  completed: Boolean
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
