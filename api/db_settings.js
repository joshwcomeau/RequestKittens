// Private database variables
var port     = 53597;
var dbName   = 'requestkittens';
var hostname = 'ds053597.mongolab.com';
var protocol = 'mongodb';
var username = process.env.REQUESTKITTENS_MONGOLAB_USERNAME;
var password = process.env.REQUESTKITTENS_MONGOLAB_PASSWORD;


// Use localhost if we don't have the environment variables set for mongolab.
var localtesting = !process.env.REQUESTKITTENS_MONGOLAB_USERNAME;

// build all of them into a public URL
exports.url  = localtesting 
? protocol + "://localhost:27017/" + dbName
: protocol + "://" + username + ":" + password + "@" + hostname + ":" + port + "/" + dbName;