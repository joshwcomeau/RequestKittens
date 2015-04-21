// DEFAULT API SERVER

var Percolator = require('percolator').Percolator;
var server = new Percolator();

server.route('/cats', {
  GET: function(req, res) {
    res.object({ message: "Hello world!" }).send();
  }
});


server.listen(function(err) {
  console.log("Server is listening on port", server.port);
});