var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs')),
    xml2js = require('xml2js'),
    server = require('../libraries/xmlServer.js');

/**
* Creates a dialog element in a JSON format to return it to Ember
*/
createDialogEmberObject = function(element){
  // create an array with the IDs for each containing line within
  // the dialog
  let lines = element.dialogLines.map(function(line){
    return { id : line.id, type : 'dialog-line' };
  });

  return {
    "attributes": {
      "name": element.name
    },

    "id": element.id,
    "type" : "dialog",

    "relationships": {
      "starting-line": {
        data : {
          id: element.startingLine.id,
          type: "dialog-line"
        }
      },

      "lines": {
        data : lines
      }
    }
  }
}

addDialog = function(object){
  dialogs.push(object);
};



exports.listAllDialogs = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  var convertedDialogs = new Array();
  server.getDialogs().forEach(function(value, key) {
    convertedDialogs.push(createDialogEmberObject(value));
  });

  res.json({ data : convertedDialogs });
}


exports.create_a_dialog = function(req, res) {
};

exports.getDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialog = server.getDialog(req.params.dialogId);
  res.json({ data : createDialogEmberObject(dialog) });
};

exports.updateDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
};

exports.delete_dialog = function(req, res) {

};
