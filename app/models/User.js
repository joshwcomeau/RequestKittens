var mongoose  = require('mongoose');

var userSchema = mongoose.Schema({
  email:   String,
  api_key: String,
  role:    { type: String, default: 'developer' }
});


module.exports = mongoose.model('User', userSchema);