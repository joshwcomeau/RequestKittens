// DEFAULT API SERVER

// vendor module dependencies
var Percolator  = require('percolator').Percolator;
var mongoose    = require('mongoose');

// local module dependencies
var routes      = require('./app/routes.js');
var dbSettings  = require('./app/db_settings.js');

var port        = 3000;

// 'global' variables and Percolator settings go here
var app         = {
  port: port
}; 

var server      = new Percolator(app);




mongoose.connect(dbSettings.url);
var db = mongoose.connection;

// Database error logging
db.on('error', console.error.bind(console, 'connection error:'));


// ROUTES
server.route('/cats',     routes.cats);
server.route('/cats/:id', routes.catsWithId);



// Some logging
server.before(function(req, res, handler, cb) {
  console.log('Request:', req.method, "to", req.url);
  console.log('API key:', req.headers.api_key)
  cb();
});

// Gogogo!
server.listen(function(err) {
  console.log("Server is listening on port", server.port);
});