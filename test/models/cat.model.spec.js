// Vendor modules
var mongoose = require("mongoose");
var chai     = require("chai");

// Local modules
var Cat      = require("../../app/models/Cat.js");

var expect   = chai.expect;
var dbUrl    = "mongodb://localhost/RequestKittensTest";


////// Tests Begin //////

describe("Cat", function() {
  var currentCat = null;

  before(function(done) {
    mongoose.connect(dbUrl);
    mongoose.connection.on('open', function() {
      // Clear the database
      Cat.remove({}, function() {
        done();
      });
    });
  });

  beforeEach(function(done) {
    var cat = new Cat({
      emotion: 'sad',
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
    Cat.findOne({emotion: 'sad'}, function(err, cat) {
      if (err) return console.error(err);

      expect(cat.name).to.equal(currentCat.name);
      done();
    });
  });


});