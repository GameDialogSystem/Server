'use strict';
module.exports = function(app) {
  var inputs = require('../controllers/inputController');

  // todoList Routes
  app.route('/inputs/:inputId')
    .get(inputs.getInput)
};
