  var fs = require('fs'),
    xml2js = require('xml2js'),
    server = require('../libraries/xmlServer.js'),
    outputController = require('./outputController.js'),
    uuidv4 = require('uuid/v4'),
    uuidv5 = require('uuid/v5');

var self = this;

exports.getDialogLine = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  server.getDialogLine(req.params.dialogLineId).then(dialogLine => {
    res.json(dialogLine);
  });
};
