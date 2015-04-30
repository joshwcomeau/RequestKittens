var fs      = require('fs');

var _       = require('underscore');
var im      = require('imagemagick');
var hat     = require('hat');
var AWS     = require('aws-sdk');
var s3      = new AWS.S3({ params: {Bucket: 'requestkittens'} });


var Cat     = require('../models/cat.model.js');
var User    = require('../models/user.model.js');
var Emotion = require('../models/emotion.model.js');




// INDEX - GET /cats
exports.index = function(req, res) {
  var opts   = req.uri.query();
  var filter = {};

  if ( opts.emotion ) {
    filter = {
      "emotion.name": opts.emotion
    };
  }


  Cat.findRandom(filter, {}, {limit: opts.numOfResults || 10}, function(err, docs) {
    if (err) {
      return res.status.internalServerError(["Oh no, the server exploded:", err]);
    } else {
      // Handle the no-cats-found case
      if (!docs) {
        return res.status.notFound(["We don't have any cats that match your query:"]);
      }

      // strip the database cat objects of fields the user doesn't need.
      cats = docs.map(function(doc) {
        var urlField = ( opts.imageSize === "all" ) ? doc.url : doc.url[opts.imageSize || "normal"];

        return {
          id: doc._id,
          url: urlField,
          emotion: doc.emotion[0].name,
          source: doc.source
        };
      }.bind(this));

      res.collection(cats).send();
    }
  });
}


// CREATE - POST /cats
exports.create = function(req, res) {
  var s3Params, binaryData, baseKey;
  var schema = {
    properties: {
      "emotion": {
        type: "string",
        required: true
      },
      "url": {
        type: "string",
        required: true
      },
      "owner": {
        type: "string",
        required: true
      }
    }
  };

  // Only users with roles 'admin' or 'creator' can create cats.
  // Throw a 401 unauthorized if their user role is 'developer'.
  if ( req.authenticated.role !== 'admin' && req.authenticated.role !== 'creator' ) {
    return res.status.unauthenticated(["Sorry, only administrators can add new cats to the database"]);
  }

  req.onJson(schema, function(err, obj) {
    var catObject;

    console.log("Received object", obj);

    // Error handling on schema failure is handled automatically by Percolator.
    // Assuming the only possible error here is invalid JSON.
    if (err) return res.status.internalServerError(["Internal server error", emoErr]);


    // Find the emotion in our DB, get its id
    Emotion.findOne({'name': obj.emotion}, function(emoErr, emo) {
      if (emoErr) return res.status.internalServerError(["Trouble with emotions", emoErr]);
      if (!emo)   return res.status.badRequest(["We don't have a '"+obj.emotion+"' emotion"]);

      // build a cat object with the data we've accrued so far and our user-submitted object.
      var catObject = {
        url: {},
        emotion: [emo],
        source: {
          url: obj.url,
          owner: obj.owner
        }
      }

      var cat = new Cat(catObject);

      // Do all the imagemagick and S3 stuff. Process and upload the image
      cat.addUrls(obj.url, req.authenticated._id)
      .then(function(result) {
        cat.save(function(mongoErr) {
          if (mongoErr) {
            return res.status.internalServerError(["We could not save the Cat:", mongoErr]);
          } else {
            res.object(cat).send();
          }
        });
      }, function(urlErr) {
        res.status.internalServerError(["Trouble processing images", urlErr]);
      });


    });

  });
}


// SHOW - GET /cats/:id
exports.show = function(req, res) {
  var catId = req.uri.child();

  // Look it up by its ID in Mongoose
  var cat = Cat.findById(catId, function(err, doc) {
    // Respond with just the found document.
    res.object(doc).send();
  });

}


// UPDATE - PUT /cats/:id
exports.update = function(req, res) {
  var catId = req.uri.child();
  var schema = {
    properties: {
      "emotion": {
        type: "string",
        required: false
      },
      "url": {
        type: "string",
        required: false
      }
    }
  };

  req.onJson(schema, function(err, obj) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      var cat = Cat.findByIdAndUpdate(catId, obj, function(err, doc) {
        // Return our freshly-modified cat.
        if (mongoErr) {
          return res.status.internalServerError(["We could not update the Cat:", mongoErr]);
        } else {
          res.object(doc).send();
        }
      });
    }
  });
}


// DESTROY - DELETE /cats/:od
exports.destroy = function(req, res) {
  var catId = req.uri.child();

  var cat = Cat.findByIdAndRemove(catId, function(err, doc) {
    // Return our freshly-modified cat.
    if (mongoErr) {
      return res.status.internalServerError(["We could not kill the Cat:", mongoErr]);
    } else {
      res.object({ deleted: true }).send();
    }      
  });
}
