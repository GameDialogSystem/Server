'use strict';
module.exports = function(app) {
  var dialogs = require('../controllers/dialogController');

  // todoList Routes
  app.route('/dialogs')
    .get(dialogs.listAllDialogs)
    .post(dialogs.create_a_dialog);

  app.route('/dialogs/:dialogId')
    .get(dialogs.getDialog)
    .patch(dialogs.updateDialog)
    .delete(dialogs.delete_dialog)
};
