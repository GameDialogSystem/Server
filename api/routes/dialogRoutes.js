'use strict';
module.exports = function(app) {
  var dialogs = require('../controllers/dialogController');

  // todoList Routes
  app.route('/dialogs')
    .get(dialogs.listAllDialogs)

  app.route('/dialogs/:dialogId')
    .get(dialogs.getDialog)
    //.patch(dialogs.updateDialog)
    //.post(dialogs.saveDialog)
    .delete(dialogs.deleteDialog)
};
