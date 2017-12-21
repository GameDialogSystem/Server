'use strict';
module.exports = function(app) {
  var connections = require('../controllers/connectionController');

  app.route('/connections/:connectionId')
    .get(connections.getConnection)
};
