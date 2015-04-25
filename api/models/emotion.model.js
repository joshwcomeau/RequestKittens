var mongoose  = require('mongoose');

var emotionSchema = mongoose.Schema({
  _id: String
});

module.exports = mongoose.model('Emotion', emotionSchema);