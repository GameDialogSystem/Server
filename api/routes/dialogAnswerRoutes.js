'use strict';
module.exports = function(app) {
  var dialogAnswers = require('../controllers/dialogAnswerController');

  // todoList Routes
  app.route('/dialog-answers/')
    .get(dialogAnswers.listAllDialogAnswers)
    .post(dialogAnswers.createDialogAnswer);

  app.route('/dialog-answers/:dialogAnswerId')
    .get(dialogAnswers.getDialogAnswer)
    .patch(dialogAnswers.updateDialogAnswer)
    .delete(dialogAnswers.deleteDialogAnswer)
};
