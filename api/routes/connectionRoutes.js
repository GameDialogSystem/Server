'use strict';
module.exports = function(app) {
  var connections = require('../controllers/connectionController');

  app.route('/dialog-connections')
    .post(connections.createConnection)

  app.route('/dialog-connections/:connectionId')
    .get(connections.getConnection)

};
