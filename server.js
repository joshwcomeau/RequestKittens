// DEFAULT API SERVER

// vendor module dependencies
var Percolator  = require('percolator').Percolator;
var mongoose    = require('mongoose');

// local module dependencies
var routes      = require('./api/routes.js');
var dbSettings  = require('./api/db_settings.js');

var port        = 3000;

// 'global' variables and Percolator settings go here
var app         = {
  port:     port,
  autoLink: false
}; 

var server      = new Percolator(app);




mongoose.connect(dbSettings.url);
var db = mongoose.connection;

// Database error logging
db.on('error', console.error.bind(console, 'connection error:'));


// ROUTES
server.route('/cats',     routes.cats);
server.route('/cats/:id', routes.catsWithId);
server.route('/users',    routes.users);
server.route('/emotions', routes.emotions);

// Forward root to sales site.
server.route('/', {
  GET: function(req, res) {
    res.status.redirect("http://joshwcomeau.github.io/RequestKittensDocs/public/index.html");
  }
})


// Some logging
server.before(function(req, res, handler, cb) {
  // Deal with OPTIONS
  if (req.method.toUpperCase() === "OPTIONS") {
    var origin = (req.headers.origin || "*");

    res.writeHead("204", "No Content", {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "content-type, accept, authorization",
      "access-control-max-age": 10, // Seconds.
      "content-length": 0
    });
    return res.end();

  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    cb();
  }

});

// Add CORS headers for cross-origin permission. AJAX ftw!
// server.after(function(req, res, handler) {
//   console.log("response");

// });

// Gogogo!
server.listen(function(err) {
  console.log("Server is listening on port", server.port);
});