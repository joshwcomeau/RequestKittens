// Vendor modules
var Percolator  = require('percolator').Percolator;
var mongoose    = require("mongoose");
var chai        = require("chai");

// Local modules
var routes      = require("../../app/routes.js");


var expect      = chai.expect;
var dbUrl       = "mongodb://localhost/RequestKittensTest";
var app         = {}; 
var server      = new Percolator(app);



// ////// Tests Begin //////

describe("Routes", function() {

});

// describe("Cat", function() {
//   var currentCat = null;

//   beforeEach(function(done) {
//     var cat = new Cat({
//       emotion: 'sad',
//       url:     'http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg'
//     });

//     mongoose.connect(dbUrl);
//     mongoose.connection.on('open', function() {
//       cat.save(function(err, doc) {
//         if (err) return console.error(err);
//         currentCat = doc;
//         done();
//       });
//     });
//   });

//   afterEach(function(done) {
//     Cat.remove({}, function() {
//       done();
//     });
//   });

//   it("has persisted a cat entry", function(done) {
//     Cat.count({}, function(err, count) {
//       if (err) return console.error(err);
//       expect(count).to.equal(1);
//       done();
//     });
//   });

//   it("can be found by emotion", function(done) {
//     Cat.findOne({emotion: 'sad'}, function(err, cat) {
//       if (err) return console.error(err);

//       expect(cat.name).to.equal(currentCat.name);
//       done();
//     });
//   });


// });