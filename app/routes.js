// INDEX - GET /cats
exports.index = function(req, res) {
  var opts = req.uri.query();

  console.log("Number of cats to show:", opts.num)
  res.object({ message: "Hello world!" }).send();
}

// SHOW - GET /cats/:id
exports.show = function(req, res) {
  console.log("request made to show")
}