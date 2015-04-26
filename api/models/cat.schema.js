var mongoose      = require('mongoose');
var EmotionSchema = require('./emotion.schema.js');

module.exports    = mongoose.Schema({
  emotion: [EmotionSchema],
  url:     { type: Object, default: {} },
  credit:  String
});