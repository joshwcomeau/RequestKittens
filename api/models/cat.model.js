var mongoose  = require('mongoose');
var random    = require('mongoose-simple-random');

var catSchema = require('./cat.schema.js');

catSchema.plugin(random);

module.exports = mongoose.model('Cat', catSchema);