var Cat = require('./models/Cat.js');

function getCatId(req) {
  return req.uri.child();
}

var schemaCreate = {
  properties: {
    "emotion": {
      type: "string",
      required: true
    },
    "url": {
      type: "string",
      required: true
    }
  }
};

var schemaUpdate = {
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
}



// INDEX - GET /cats
exports.index = function(req, res) {
  var opts   = req.uri.query();
  var filter = {};

  if ( opts.emotion ) filter.emotion = opts.emotion;

  var cat    = Cat.findOneRandom(filter, function(err, doc) {
    if (err) {
      return res.status.internalServerError(["Oh no, the server exploded:", err]);
    } else {
      // Handle the no-cats-found case
      console.log(doc);
      if (!doc) {
        return res.status.notFound(["We don't have any cats that match your query:"]);
      }
      res.object(doc).send();
    }
  });
}


// CREATE - POST /cats
exports.create = function(req, res) {

  req.onJson(schemaCreate, function(err, obj) {
    // Error handling on schema failure is handled automatically by Percolator.
    // Assuming the only possible error here is invalid JSON.
    if (err) {
      console.log("ERROR:", err);
    } else {

      var cat = new Cat(obj);
      cat.save(function(mongoErr) {
        if (mongoErr) {
          return res.status.internalServerError(["We could not save the Cat:", mongoErr]);
        } else {
          res.object(cat).send();
        }
      });
    }
  });
}


// SHOW - GET /cats/:id
exports.show = function(req, res) {
  var catId = getCatId(req);

  // Look it up by its ID in Mongoose
  var cat = Cat.findById(catId, function(err, doc) {
    // Respond with just the found document.
    res.object(doc).send();
  });

}


// UPDATE - PUT /cats/:id
exports.update = function(req, res) {
  var catId = getCatId(req);

  req.onJson(schemaUpdate, function(err, obj) {
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
  var catId = getCatId(req);

  var cat = Cat.findByIdAndRemove(catId, function(err, doc) {
    // Return our freshly-modified cat.
    if (mongoErr) {
      return res.status.internalServerError(["We could not kill the Cat:", mongoErr]);
    } else {
      res.object({ deleted: true }).send();
    }      
  });


}