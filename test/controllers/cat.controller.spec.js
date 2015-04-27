// Vendor modules
var Percolator    = require('percolator').Percolator;
var hottap        = require('hottap').hottap;
var mongoose      = require("mongoose");
var chai          = require("chai");
var Promise       = require('es6-promise').Promise;

// Local modules
var Cat           = require("../../api/models/cat.model.js");
var User          = require("../../api/models/user.model.js");
var Emotion       = require("../../api/models/emotion.model.js");
var routes        = require("../../api/routes.js");



var expect        = chai.expect;
var dbUrl         = "mongodb://localhost/RequestKittensTest";
var port          = 9000;

var app           = { port: port }; 
var server;

var baseUrl       = "http://localhost:"+port;
var catIndexUrl   = baseUrl + "/cats";
var catPostUrl    = catIndexUrl;
var userIndexUrl  = baseUrl + "/users";

var ApiKey, AdminApiKey;

var emotionSad, emotionSurprised, emotionHappy, emotionConfused;

////// Tests Begin //////

describe("Cat Routes", function() {
  before(function(done) {
    if ( !mongoose.connection.db ) mongoose.connect(dbUrl);

    // set up our server
    server = new Percolator(app);

    // set up our default routes
    server.route('/cats',     routes.cats);
    server.route('/cats/:id', routes.catsWithId);
    server.route('/users',    routes.users);

    // Wipe the test DB cats and users
    Cat.remove({})
    .then(function() {
      return User.remove({});
    })
    // Add emotions to the DB
    .then(function() {
      var emotionArray = [ {name: 'sad'}, {name: 'surprised'}, {name: 'happy'}, {name: 'confused'} ];

      return Emotion.create(emotionArray, function(err, emotions) {  
        if (err) console.log("\n\nERROR CREATING EMOTIONS", err);

        emotionSad        = emotions[0];
        emotionSurprised  = emotions[1];
        emotionHappy      = emotions[2];
        emotionConfused   = emotions[3];

        return emotions;
      });    
    })    

    // Add our admin user who can create cats
    .then(function() {
      return User.create({ email: "admin@user.com", api_key: 'ADMINUSER', role: 'creator' }, function(err, user) {
        if (err) console.log("\n\nERROR CREATING ADMIN USER", err);
        AdminApiKey = user.api_key;
        return user;
      });
    })

    // Add our test user, get a valid API key
    .then(function() {
      return User.create({ email: "test@user.com" }, function(err, user) {
        if (err) console.log("\n\nERROR CREATING TEST USER", err);
        ApiKey = user.api_key;
        return user;
      });      
    })
  
    // start the server. We're good to go.
    .then(function() {
      return server.listen(done);  
    });

  });

  after(function(done) {
    server.close(done);
  });





  ///////////////////// CREATE ROUTE ////////////////////
  describe("Cat Create", function () {
    var catData = { 
      "emotion": "happy",
      "url":     "testurl",
      "owner":   "Jane Doe"
    };

    after(function(done) {
      Cat.remove({}, done);
    });

    // Quick baseline tests, ones that should not persist cats.
    it("Contains zero cats at first", function(done) {
      Cat.find({}).count(function(err, count) {
        expect(count).to.equal(0);
        done();
      });
    });

    it("doesn't let unauthenticated user create a cat", function(done) {
      hottap(catPostUrl).json("POST", 
        {},
        catData,
        function(err, res) {
          expect(res.status).to.equal(401);
          done();
        }
      );
    });

    it("doesn't let average joe create a cat", function(done) {
      hottap(catPostUrl).json("POST", 
        { "Authorization": ApiKey }, 
        catData,
        function(err, res) {
          expect(res.status).to.equal(401);
          done();
        }
      );
    });

    it("doesn't persist cats without a supplied emotion", function(done) {
      hottap(catPostUrl).json("POST", 
        { "Authorization": AdminApiKey }, 
        { "url":"testurl", "creator":"person" },
        function(err, res) {
          expect(res.status).to.equal(400);
          done();
        }
      );
    });

    it("doesn't persist cats with an invalid emotion", function(done) {
      hottap(catPostUrl).json("POST", 
        { "Authorization": AdminApiKey }, 
        { "emotion":"stupid", "url":"testurl", "creator":"person" },
        function(err, res) {
          expect(res.status).to.equal(400);
          done();
        }
      );
    });

    it("doesn't persist cats without a supplied url", function(done) {
      hottap(catPostUrl).json("POST", 
        { "Authorization": AdminApiKey }, 
        { "emotion":"happy", "creator":"person" },
        function(err, res) {
          expect(res.status).to.equal(400);
          done();
        }
      );
    });

    // More thorough tests, that persist cats
    describe("authorized creation", function() {
      var response;

      before(function(done) {
        hottap(catPostUrl).json("POST", 
          { "Authorization": AdminApiKey }, 
          catData,
          function(err, res) {
            response = res;
            done();
          }
        );
      });

      it("returns 200 OK", function(done) {
        expect(response.status).to.equal(200);
        done();
      });

      it("attaches an appropriate emotion object to the cat", function(done) {
        expect(response.body.emotion[0]).to.have.all.keys("name", "_id", "__v");
        done();
      });

      describe("shuffled input for logical output", function() {
        it("created a 'source' object with appropriate keys", function(done) {
          expect(response.body.source).to.have.all.keys("owner", "url");
          done();
        });

        it("populated the source URL with our input URL", function(done) {
          expect(response.body.source.url).to.equal(catData.url);
          done();
        });

        it("populated the source owner with our input owner", function(done) {
          expect(response.body.source.owner).to.equal(catData.owner);
          done();
        });
      });


      it("has persisted the cat in MongoDB", function(done) {
        Cat.findOne({}, function(err, doc) {
          expect(doc.source.owner).to.equal(response.body.source.owner);
          expect(doc.emotion.name).to.equal(response.body.emotion.name);
          done();
        });
      });

    });

  });





  ///////////////// INDEX ROUTE //////////////////////////
  describe("Cat Index", function() {
    var snowball, cookie, tiger;

    before(function(done) {

      // Create some cats
      cats = [
        {
          emotion: emotionSad,
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg'
        },{
          emotion: emotionSurprised,
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/286.jpg'
        },{
          emotion: emotionSurprised,
          url:     'http://dreamatico.com/data_images/kitten/kitten-2.jpg'
        },{
          emotion: emotionHappy,
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/287.jpg'
        },{
          emotion: emotionConfused,
          url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/140.jpg'
        },{
          emotion: emotionConfused,
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


    it("returns 401 unauthorized without an API key", function(done) {
      hottap(catIndexUrl).json("GET", function(err, res) {
        expect(res.status).to.equal(401);
        done();
      });
    });


    it("returns 200 OK", function(done) {
      hottap(catIndexUrl).json("GET", { "Authorization": ApiKey }, function(err, res) {
        expect(res.status).to.equal(200);
        done();
      })
    });

    it("returns an array of Cats", function(done) {
      hottap(catIndexUrl).json("GET", { "Authorization": ApiKey }, function(err, res) {
  
        expect(res.body).to.have.all.keys("_items", "_links");
        expect(res.body._items).to.be.an('array');
        done();
      });
    });

    it("returns the number of cats specified", function(done) {
      var url = catIndexUrl + "?num_of_results=2";

      hottap(url).json("GET", { "Authorization": ApiKey }, function(err, res) {
        expect(res.body._items).to.have.length(2);
        done();
      });
    });

    it("returns the emotion specified", function(done) {
      var url = catIndexUrl + "?emotion=confused";

      hottap(url).json("GET", { "Authorization": ApiKey }, function(err, res) {
        expect(res.body._items[0].emotion[0].name).to.equal("confused");
        expect(res.body._items[1].emotion[0].name).to.equal("confused");
        done();
      });
    });


  });



});

