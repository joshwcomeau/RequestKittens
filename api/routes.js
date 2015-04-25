var User           = require('./models/user.model.js');

var catController  = require('./controllers/cat.controller.js');
var userController = require('./controllers/user.controller.js');
var emoController  = require('./controllers/emotion.controller.js');

function authenticate(req, res, cb) {
  var ApiKey = req.headers.authorization;
  return User.findOne({api_key: ApiKey}, function(err, user) {
    // If there was an error, it's a 500 error.
    if (err) return cb("500 error");

    // If the user wasn't found, the user isn't registered.
    if (!user) return cb(true);

    // Add in some logic here for banned users.

    return cb(false, user);
  });

}


// ROUTE: /cats
exports.cats = {
  authenticate: authenticate,
  GET:          catController.index,
  POST:         catController.create
}

// ROUTE: /cats/:id
exports.catsWithId = {
  authenticate: authenticate,  
  GET:          catController.show,
  PUT:          catController.update,
  DELETE:       catController.destroy
}

// ROUTE: /users
exports.users = {
  POST:         userController.create
}

// ROUTE: /emotions
exports.emotions = {
  authenticate: authenticate,
  GET:          emoController.index
}