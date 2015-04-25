// Vendor modules
var mongoose = require("mongoose");
var chai     = require("chai");

// Local modules
var Cat      = require("../../api/models/cat.model.js");
var Emotion  = require("../../api/models/emotion.model.js");

var expect   = chai.expect;
var dbUrl    = "mongodb://localhost/RequestKittensTest";


////// Tests Begin //////

describe("Cat", function() {
  var currentCat = null;

  beforeEach(function(done) {
    if ( !mongoose.connection.db ) mongoose.connect(dbUrl);

    var cat = new Cat({
      emotion: new Emotion({ name: 'sad'}),
      url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg'
    });

    cat.save(function(err, doc) {
      if (err) return console.error(err);
      currentCat = doc;
      done();
    });


  });

  afterEach(function(done) {
    Cat.remove({}, function() {
      done();
    });
  });

  it("has persisted a cat entry", function(done) {
    Cat.count({}, function(err, count) {
      if (err) return console.error(err);
      expect(count).to.equal(1);
      done();
    });
  });

  it("can be found by emotion", function(done) {
    Cat.findOne({"emotion.name": 'sad'}, function(err, cat) {
      if (err) return console.error(err);

      expect(cat.url).to.equal(currentCat.url);
      done();
    });

  });


});