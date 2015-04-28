var mongoose      = require('mongoose');
var EmotionSchema = require('./emotion.schema.js');

module.exports    = new mongoose.Schema({
  emotion: [EmotionSchema],
  url:     { type: Object, default: {} },
  source:  { type: Object, default: {} }
});