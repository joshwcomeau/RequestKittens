// Vendor modules
var Percolator    = require('percolator').Percolator;
var hottap        = require('hottap').hottap;
var mongoose      = require("mongoose");
var chai          = require("chai");

// Local modules
var routes        = require("../../api/routes.js");
var User          = require("../../api/models/user.model.js");



var expect        = chai.expect;
var dbUrl         = "mongodb://localhost/RequestKittensTest";
var port          = 9000;

var app           = { port: port, autoLink: false }; 
var server;

var baseUrl       = "http://localhost:"+port;
var userIndexUrl  = baseUrl + "/users";

////// Tests Begin //////

describe("User Routes", function() {
  before(function(done) {
    if ( !mongoose.connection.db ) mongoose.connect(dbUrl);

    // set up our server
    server = new Percolator(app);

    // set up our default routes
    server.route('/users',     routes.users);

    server.listen(done);
  });

  after(function(done) {
    server.close(done);
  });

  describe("POSTing a new user", function() {
    beforeEach(function(done) {
      User.remove({}, done);
    });

    it("creates a new user and returns a generated API key", function(done) {
      hottap(userIndexUrl).json("POST", {}, {"email":"josh@ua.com"}, function(req, res) {

        expect(res.status).to.equal(200);
        expect(res.body).to.have.all.keys("email", "api_key");
        expect(res.body.api_key).to.be.a('string');
        done();
      });
    });

    it("does not create a user with duplicate email", function(done) {
      // Start by creating a user in the database
      User.create({ email: 'josh@ua.com' }, function(err, doc) {
        if (err) console.log(err);

      }).then(function() {
        hottap(userIndexUrl).json("POST", {}, {"email":"josh@ua.com"}, function(req, res) {

          expect(res.status).to.equal(400);

          User.where({ 'email': 'josh@ua.com'}).count(function(err, count) {
            expect(count).to.equal(1);
            done();
          });

          
        });
      });
    });
  });





});

