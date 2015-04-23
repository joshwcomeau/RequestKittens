// Vendor modules
var Percolator    = require('percolator').Percolator;
var hottap        = require('hottap').hottap;
var mongoose      = require("mongoose");
var chai          = require("chai");

// Local modules
var routes        = require("../../app/routes/user.routes.js");
var User          = require("../../app/models/User.js");



var expect        = chai.expect;
var dbUrl         = "mongodb://localhost/RequestKittensTest";
var port          = 9000;

var app           = { port: port, autoLink: false }; 
var server;

var baseUrl       = "http://localhost:"+port;
var userIndexUrl  = baseUrl + "/users";

////// Tests Begin //////

describe("User Routes", function() {
  beforeEach(function(done) {
    if ( !mongoose.connection.db ) mongoose.connect(dbUrl);

    // set up our server
    server = new Percolator(app);

    // set up our default routes
    server.route('/users',     routes.users);

    server.listen(done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  describe("POSTing a new user", function() {
    it("creates a new user and returns data", function(done) {
      var url = userIndexUrl + "?email=josh@ua.com";

      hottap(url).json("POST", {}, {"email":"josh@ua.com"}, function(req, res) {

        expect(res.status).to.equal(200);
        expect(res.body).to.have.all.keys("email", "api_key");
        done();
      });
    });
  });





});

