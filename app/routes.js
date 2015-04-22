var Cat = require('./models/Cat.js');

// INDEX - GET /cats
exports.index = function(req, res) {
  var opts = req.uri.query();

  console.log("Number of cats to show:", opts.num)
  res.object({ message: "Hello world!" }).send();
}

// SHOW - GET /cats/:id
exports.show = function(req, res) {
}

exports.create = function(req, res) {

  var schema = {
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

  req.onJson(function(err, obj) {
    console.log("error:", err);
    console.log("object:", obj);

    var cat = new Cat(obj);
    cat.save(function(mongoErr) {
      if (mongoErr) {
        return res.status.internalServerError(["We could not save the Cat:", mongoErr]);
      } else {
        res.object({ cat: cat }).send();
      }
    })
  });


}