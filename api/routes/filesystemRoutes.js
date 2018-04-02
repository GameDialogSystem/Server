'use strict';
module.exports = function(app) {
  var io = require('../controllers/filesystemController');

  app.route('/io/:path')
    .get(io.getFiles)
};
