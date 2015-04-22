// Private database variables
var port     = 53597;
var dbName   = 'requestkittens';
var hostname = 'ds053597.mongolab.com';
var protocol = 'mongodb';
var username = process.env.REQUESTKITTENS_MONGOLAB_USERNAME;
var password = process.env.REQUESTKITTENS_MONGOLAB_PASSWORD;

// build all of them into a public URL
exports.url  = protocol + "://" + username + ":" + password + "@" + hostname + ":" + port + "/" + dbName;