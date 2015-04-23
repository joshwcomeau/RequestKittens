var User = require('../models/User.js');

function getUserId(req) {
  return req.uri.child();
}

var schemaCreate = {
  properties: {
    "email": {
      type: "string",
      required: true
    }
  }
};



// CREATE - POST /users
exports.create = function(req, res) {

  req.onJson(schemaCreate, function(err, obj) {
    // Error handling on schema failure is handled automatically by Percolator.
    // Assuming the only possible error here is invalid JSON.
    if (err) {
      console.log("ERROR:", err);
    } else {

      var user = new User(obj);
      user.save(function(mongoErr) {
        if (mongoErr) {
          return res.status.internalServerError(["We could not generate an API key:", mongoErr]);
        } else {
          res.object(user).send();
        }
      });
    }
  });
}




//// SHORTHAND ROUTE OBJECTS FOR PERCOLATOR

exports.users = {
  POST:   exports.create
}
