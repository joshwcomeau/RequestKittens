var mongoose    = require('mongoose');

var userSchema  = require('./user.schema.js')

module.exports  = mongoose.model('User', userSchema);