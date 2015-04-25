var mongoose  = require('mongoose');
var random    = require('mongoose-simple-random');

var catSchema = mongoose.Schema({
  emotion: {type : mongoose.Schema.ObjectId, ref : 'Emotion'},
  url:     String
});

catSchema.plugin(random);

module.exports = mongoose.model('Cat', catSchema);