var mongoose  = require('mongoose');
var emotionSchema = require('./emotion.schema.js');


module.exports = mongoose.model('Emotion', emotionSchema);