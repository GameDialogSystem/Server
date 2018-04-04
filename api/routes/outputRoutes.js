'use strict';
module.exports = function(app) {
  var outputs = require('../controllers/outputController');

  app.route('/outputs')
    .post(outputs.createOuput);

  app.route('/outputs/:outputId')
    .get(outputs.getOutput)
    .delete(outputs.deleteOutput)
    .patch(outputs.updateOutput)
};
