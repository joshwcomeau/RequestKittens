var mongoose  = require('mongoose');
var catSchema = mongoose.Schema({
  emotion: String,
  url:     String
});

module.exports = mongoose.model('Cat', catSchema);