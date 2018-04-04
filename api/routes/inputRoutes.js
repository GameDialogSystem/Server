'use strict';
module.exports = function(app) {
  var inputs = require('../controllers/inputController');

  app.route('/inputs')
    .post(inputs.createInput);

  app.route('/inputs/:inputId')
    .get(inputs.getInput)
    .delete(inputs.deleteInput)
    .patch(inputs.updateInput)
};
