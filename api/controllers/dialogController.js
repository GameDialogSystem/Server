var fileUtil = require("../libraries/fileUtility.js"),
    xmlUtil = require("../libraries/xmlUtility.js"),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require("fs")),
    xml2js = require("xml2js"),
    server = require("../libraries/xmlServer.js"),

    dialogLineController = require("./dialogLineController.js");

var self = this;
/**
* Creates a dialog element in a JSON format to return it to Ember
*/
exports.createDialogEmberObject = function(element){
  // create an array with the IDs for each containing line within
  // the dialog
  let lines = element.dialogLines.map(function(line){
    return dialogLineController.createDialogLineEmberObject(line); //{ id : line.id, type : "dialog-line" };
  });

  let relationshipLines = element.dialogLines.map(function(line){
    return { id : line.id, type : "dialog-line" };
  });

  let result = {
    "data": {
      "id": element.id,
      "type" : "dialog",
      "attributes": {
        "name": element.name
      },

      "relationships": {
        "starting-line": {
          "data" : {
            "id": element.startingLine.id,
            "type": "dialog-line"
          }
        },

        "lines": {
          "data": relationshipLines
        }
      }
    },

    "included": lines
  }

  console.log(result);

  return result;
}

addDialog = function(object){
  dialogs.push(object);
};



exports.listAllDialogs = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  var convertedDialogs = new Array();
  server.getDialogs().forEach(function(value, key) {
    convertedDialogs.push(self.createDialogEmberObject(value).data);
  });

  res.json({ "data": convertedDialogs });
}


exports.createDialog = function(req, res) {
};

exports.getDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialog = server.getDialog(req.params.dialogId);
  res.json(self.createDialogEmberObject(dialog));
};

exports.updateDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
};

exports.deleteDialog = function(req, res) {

};
