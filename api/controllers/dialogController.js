const server = require("../libraries/xmlServer.js");
const builder = require('../libraries/builder/xmlBuilder.js');
const path = require('path');

exports.listAllDialogs = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  var elements = [];
  server.getDialogs().forEach((value, key, map) => {
    elements.push(value.data);
  });

  res.json({ "data" : elements });
}


exports.createDialog = function(req, res) {

};

exports.saveDialog = function(req, res) {
  res.json({ "data" : elements });
};

exports.getDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  server.getDialog(req.params.dialogId).then(dialog => {
    let lines = dialog.data.relationships.lines.data.map(line => { return line.id;});
    let object = {
      "dialog": {
        "id": dialog.data.id,
        "lines": lines
      }
    }

    res.json(dialog);
  }, (reason) => {
    res.status(404).send(`file ${req.params.dialogId} does not exist or is not a valid file`);
  })
};

exports.updateDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json(req.body);
};

exports.deleteDialog = function(req, res) {

};
