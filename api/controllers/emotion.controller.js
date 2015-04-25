var Emotion = require('../models/emotion.model.js');


// CREATE - POST /users
exports.index = function(req, res) {

  var emotions = Emotion.find({}, function(err, doc) {
    if (err) {
      return res.status.internalServerError(["Oh no, the server exploded:", err]);
    } else {
      // Handle the no-cats-found case
      if (!doc) {
        return res.status.notFound(["We don't have any emotions:", err]);
      }
      
      res.collection(doc).send();
    }
  });
};