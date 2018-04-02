var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs')),
    xml2js = require('xml2js'),
    server = require('../libraries/xmlServer.js');
const uuidv5 = require('uuid/v5');

exports.listAllDialogAnswers = function(req, res) {
};

createDialogAnswerObject = function(dialogAnswer){
  let answer = {
    attributes: {
      response: dialogAnswer.text,
      requirement: dialogAnswer.requirement,
      requirementValue: dialogAnswer.requirementValue
    },

    id: dialogAnswer.id,
    type : 'dialog-answer',
  };

  if(dialogAnswer.nextLine !== undefined){
    answer['relationships'] = {
      'input': {
        data : {
          id : uuidv5('dialog-line '+dialogAnswer.nextLine.id, '787b05d6-1b55-4c0c-981e-834fbdcc951d'),
          type : 'input'
        }
      }
    }
  }

  return answer;
};

exports.createDialogAnswer = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  //server.addLineToDialog
};


exports.getDialogAnswer = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialogAnswer = server.getDialogAnswer(req.params.dialogAnswerId);
  res.json({ data : createDialogAnswerObject(dialogAnswer) });
};

exports.updateDialogAnswer = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD")
  res.header("Access-Control-Allow-Headers", "*");

  let dialogAnswer = server.getDialogAnswer(req.params.dialogAnswerId);
  let newMessage = req.body.data.attributes.response;
  dialogAnswer.text = newMessage;

  let dialog = dialogAnswer.belongsTo.belongsToDialog;

  server.saveDialog(dialog);

  res.json({ data : createDialogAnswerObject(dialogAnswer) });
};

exports.deleteDialogAnswer = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD")
  res.header("Access-Control-Allow-Headers", "*");

  let dialogAnswer = server.getDialogAnswer(req.params.dialogAnswerId);
  let dialog = dialogAnswer.belongsTo.belongsToDialog;
  server.removeDialogAnswer(dialog, dialogAnswer);

  server.saveDialog(dialog);

  res.json({ data : createDialogAnswerObject(dialogAnswer) });
};
