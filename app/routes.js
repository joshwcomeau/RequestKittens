// INDEX - GET /cats
exports.index = function(req, res) {
  res.object({ message: "Hello world!" }).send();
}

// SHOW - GET /cats/:id
exports.show = function(req, res) {
  console.log("request made to show")
}