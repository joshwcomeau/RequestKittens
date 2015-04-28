var fs        = require('fs');
var _         = require('underscore');
var mongoose  = require('mongoose');
var random    = require('mongoose-random');
var im        = require('imagemagick');
var hat       = require('hat');
var AWS       = require('aws-sdk');
var Promise   = require('es6-promise').Promise;

var s3        = new AWS.S3({ params: {Bucket: 'requestkittens'} });


var catSchema = require('./cat.schema.js');

catSchema.plugin(random);

// Add the ability to process URLs as images
catSchema.methods.processAndUploadImage = function(input, output, size, customOpts) {
  var defaultOpts = { srcPath: input, format: 'jpg' };
  var opts        = _.extend(defaultOpts, customOpts);

  var outputBase  = "https://s3.amazonaws.com/requestkittens/";
  var outputPath  = output + "/" + size + ".jpg";

  var catObj      = this;

  return new Promise(function(resolve, reject) {
    this.identifyImage(input)
    .then(function(features) {
      return this.resize(opts, features);
    }.bind(this))
    .then(function(photoData) {
      return this.uploadToS3(photoData, outputPath)
    }.bind(this))
    .then(function() {
      // update local model, we're done!
        catObj.url[size] = outputBase + outputPath;
        resolve();
    }, function(err) {
      reject(err);
    });
  }.bind(this));      //     end Promise
};                   //      end catSchema.processAndUploadImage()


catSchema.methods.identifyImage = function(input) {
  return new Promise(function(resolve, reject) {
    im.identify(input, function(err, features) {
      err ? reject(err) : resolve(features);
    });
  }); 
};

catSchema.methods.resize = function(opts, features) {
  return new Promise(function(resolve, reject) {
    opts.width = features.width > opts.width ? opts.width : features.width;

    im.resize(opts, function(resizeErr, stdout, stderr) {
      resizeErr ? reject(resizeErr) : resolve(stdout);
    });
  });
};

catSchema.methods.uploadToS3 = function(photoData, outputPath) {
  return new Promise(function(resolve, reject) {
    var binaryData, s3Params;
    
    binaryData = new Buffer(photoData, 'binary');

    s3Params = {
      Key:  outputPath,
      Body: binaryData
    };

    s3.putObject(s3Params, function(s3err, data) {
      s3err ? reject(s3err) : resolve(data);
    }); 
  });
};



catSchema.methods.addUrls = function(inputUrl, userId) {
  // takes an input URL like http://site.com/img.jpg, and uploads
  // 4 different versions of the URL for use in the API (thumb, small, medium, full)
  var thumbSettings   = { width: 200, height: 200 };
  var normalSettings  = { width: 500  };
  var fullSettings    = { width: 3000 };

  // Figure out our output base URL
  var outputBaseUrl = userId + "-" + hat();

  return new Promise(function(resolve, reject) {
    if (inputUrl === "testurl") {
      // 'testurl' is a special value that bypasses the storage in Amazon S3.
      // This is so that our specs can test Cat creation without polluting our S3 bucket.
      resolve();
      return false;
    }

    this.processAndUploadImage(inputUrl, outputBaseUrl, "thumb", thumbSettings)
    .then(function() {
      return this.processAndUploadImage(inputUrl, outputBaseUrl, "normal", normalSettings);
    }.bind(this))
    .then(function() {
      return this.processAndUploadImage(inputUrl, outputBaseUrl, "full", fullSettings);
    }.bind(this))
    .then(function(results) {
      // we're done! success
      resolve(results);
      return true;
    }, function(err) {
      console.log("Oh no, we failed.", err);
      reject(err);
      return false;
    });
  }.bind(this));




}

module.exports = mongoose.model('Cat', catSchema);