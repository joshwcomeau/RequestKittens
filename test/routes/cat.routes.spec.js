// Vendor modules
var Percolator  = require('percolator').Percolator;
var hottap      = require('hottap').hottap;
var mongoose    = require("mongoose");
var chai        = require("chai");

// Local modules
var routes      = require("../../app/routes.js");
var Cat         = require("../../app/models/Cat.js");



var expect      = chai.expect;
var dbUrl       = "mongodb://localhost/RequestKittensTest";
var port        = 9000;

var app         = { port: port }; 
var server;

var baseUrl     = "http://localhost:"+port;
var catIndexUrl = baseUrl + "/cats";

////// Tests Begin //////

describe("Routes", function() {
  beforeEach(function(done) {
    if ( !mongoose.connection.db ) mongoose.connect(dbUrl);

    // set up our server
    server = new Percolator(app);

    // set up our default routes
    server.route('/cats',     routes.cats);
    server.route('/cats/:id', routes.catsWithId);

    server.listen(done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  // Quick spec before we populate DB
  it("responds with a 404 when index has no cats", function(done) {
    
    hottap(baseUrl).request("GET", function(err, res) {
      expect(res.status).to.equal(404);
      done();
    });
  });

  describe("when there are cats in the database", function() {
    var snowball, cookie, tiger;

    before(function(done) {
      // Create some cats
      cats = [
        {
          emotion: 'sad',
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg'
        },{
          emotion: 'surprised',
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/286.jpg'
        },{
          emotion: 'surprised',
          url:     'http://dreamatico.com/data_images/kitten/kitten-2.jpg'
        },{
          emotion: 'happy',
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/287.jpg'
        },{
          emotion: 'confused',
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/140.jpg'
        },{
          emotion: 'confused',
          url:     'http://cdn.attackofthecute.com/January-20-2014-20-46-56-k.jpg'
        }
      ];

      Cat.create(cats, function(err, docs) {
        // Assign some cat variables for future tests.
        snowball = docs[0];
        cookie   = docs[1];
        tiger    = docs[2];

        done();
      });
    });

    after(function(done) {
      Cat.remove({}, done);
    });

    it("returns 200 OK", function(done) {
      hottap(catIndexUrl).request("GET", function(err, res) {
        expect(res.status).to.equal(200);
        done();
      })
    });

    it("returns an array of Cats", function(done) {
      hottap(catIndexUrl).request("GET", function(err, res) {
        var parsedResponse = JSON.parse(res.body);
        expect(parsedResponse).to.have.all.keys("_items", "_links");
        expect(parsedResponse._items).to.be.an('array');
        done();
      });
    });

    it("returns the number of cats specified", function(done) {
      var url = catIndexUrl + "?num_of_results=2";

      hottap(url).request("GET", function(err, res) {
        var parsedResponse = JSON.parse(res.body);

        expect(parsedResponse._items).to.have.length(2);
        done();
      });
    });

    it("returns the emotion specified", function(done) {
      var url = catIndexUrl + "?emotion=confused";

      hottap(url).request("GET", function(err, res) {
        var parsedResponse = JSON.parse(res.body);

        expect(parsedResponse._items[0].emotion).to.equal("confused");
        expect(parsedResponse._items[1].emotion).to.equal("confused");
        done();
      });
    });


  });



});

