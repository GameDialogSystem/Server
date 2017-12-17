'use strict';
module.exports = function(app) {
  var dialogLines = require('../controllers/dialogLineController');

  // todoList Routes
  //app.route('/dialog-lines/')
  //  .post(dialogLines.createDialogLine);

  app.route('/dialog-lines/:dialogLineId')
    .get(dialogLines.getDialogLine)
    //.patch(dialogLines.updateDialogLine)
    //.delete(dialogLines.deleteDialogLine)
};
