var catController  = require('./controllers/cat.controller.js');
var userController = require('./controllers/cat.controller.js');

//// SHORTHAND ROUTE OBJECTS FOR PERCOLATOR

// ROUTE: /cats
exports.cats = {
  GET:    catController.index,
  POST:   catController.create
}

// ROUTE: /cats/:id
exports.catsWithId = {
  GET:    catController.show,
  PUT:    catController.update,
  DELETE: catController.destroy
}

// ROUTE: /users
exports.users = {
  POST:   userController.create
}
