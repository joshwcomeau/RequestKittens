var mongoose  = require('mongoose');
var hat       = require('hat');

var userSchema = mongoose.Schema({
  email:   String,
  api_key: { type: String, default: hat() },
  role:    { type: String, default: 'developer' }
});


module.exports = mongoose.model('User', userSchema);