// DEFAULT API SERVER
var routes      = require('./app/routes.js');
var app         = {};

var Percolator  = require('percolator').Percolator;
var server      = new Percolator(app);



server.route('/cats', {
  GET: routes.index
});


server.listen(function(err) {
  console.log("Server is listening on port", server.port);
});