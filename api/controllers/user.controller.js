var User = require('../models/user.model.js');


// CREATE - POST /users
exports.create = function(req, res) {
  var schema = {
    properties: {
      "email": {
        type: "string",
        required: true
      }
    }
  };

  req.onJson(schema, function(err, obj) {
    // Error handling on schema failure is handled automatically by Percolator.
    // Assuming the only possible error here is invalid JSON.
    if (err) {
      console.log("ERROR:", err);
    } else {
      var user = new User(obj);

      user.save(function(mongoErr) {
        if (mongoErr) {        
          if ( mongoErr.code === 11000 || mongoErr.code === 11001 ) {
            return res.status.badRequest(["Sorry, you've already generated an API key from this email address before.", mongoErr]);
          } else {
            return res.status.internalServerError(["We could not generate an API key:", mongoErr]);  
          }
          
        } else {
          res.object({email: user.email, api_key: user.api_key}).send();
        }
      });
    }
  });
};