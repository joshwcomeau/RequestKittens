var fs        = require('fs');
var _         = require('underscore');
var mongoose  = require('mongoose');
var random    = require('mongoose-simple-random');
var im        = require('imagemagick');
var hat       = require('hat');
var AWS       = require('aws-sdk');
var Promise   = require('es6-promise').Promise;

var s3        = new AWS.S3({ params: {Bucket: 'requestkittens'} });


var catSchema = require('./cat.schema.js');

catSchema.plugin(random);

// Add the ability to process URLs as images
catSchema.methods.uploadImage = function(input, output, size, customOpts) {
  var s3Params, binaryData;
  var defaultOpts = { srcPath: input, format: 'jpg' };
  var opts        = _.extend(defaultOpts, customOpts);

  var outputBase  = "https://s3.amazonaws.com/requestkittens/";
  var outputPath  = output + "/" + size + ".jpg";

  var catObj      = this;

  return new Promise(function(resolve, reject) {
    im.identify(input, function(identifyErr, features) {
      if (identifyErr) {
        console.error(identifyErr);
        reject(identifyErr);
        return false;
      }

      if ( size === 'full' ) {
        // We have a max allowable size of 3000x2000. If we're in 'full' mode,
        // set the width/height to its natural size so long as it doesn't
        // exceed this max.
        opts.width  = features.width  > 3000 ? 3000 : features.width;
        opts.height = features.height > 2000 ? 2000 : features.height;
      }

      im.resize(opts, function(resizeErr, stdout, stderr) {
        if (resizeErr) {
          console.error(resizeErr);
          reject(resizeErr);
          return false;
        }

        binaryData = new Buffer(stdout, 'binary');

        s3Params = {
          Key:  outputPath,
          Body: binaryData
        };

        s3.putObject(s3Params, function(s3err, data) {
          if (s3err) {
            console.error(s3err);
            reject(s3err);
            return false;
          } else {
            // Save this as part of the cat URL object
            catObj.url[size] = outputBase + outputPath;
            resolve(data);
          }
        });   //  end S3 putObject
      });    //   end Resize
    });     //    end Identify
  });      //     end Promise
};        //      end catSchema.uploadImage()

catSchema.methods.addUrls = function(inputUrl, userId) {
  // takes an input URL like http://site.com/img.jpg, and uploads
  // 4 different versions of the URL for use in the API (thumb, small, medium, full)
  var thumbSettings   = { width: 200, height: 200 };
  var smallSettings   = { width: 480 };
  var mediumSettings  = { width: 960 };
  var fullSettings    = {};

  // Figure out our output base URL
  var outputBaseUrl = userId + "-" + hat();

  return this.uploadImage(inputUrl, outputBaseUrl, "thumb", thumbSettings)
  .then(function() {
    return this.uploadImage(inputUrl, outputBaseUrl, "small", smallSettings);
  }.bind(this))
  .then(function() {
    return this.uploadImage(inputUrl, outputBaseUrl, "medium", mediumSettings);
  }.bind(this))
  .then(function() {
    return this.uploadImage(inputUrl, outputBaseUrl, "full", fullSettings);
  }.bind(this))
  .then(function(results) {
    // we're done! success
    return true;
  }, function(err) {
    console.log("Oh no, we failed.", err);
    return false;
  });



}

module.exports = mongoose.model('Cat', catSchema);