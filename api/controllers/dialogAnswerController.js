var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs')),
    xml2js = require('xml2js'),
    server = require('../libraries/xmlServer.js');

exports.listAllDialogAnswers = function(req, res) {
  console.log("List All Dialogs");
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
      'next-dialog-line': {
        data : {
          id : dialogAnswer.nextLine.id,
          type : 'dialog-line'
        }
      }
    }
  }

  return answer;
};

exports.createDialogAnswer = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  readFile('../../../files/foo.xml', function(result){
    parseStringFromFile(result, function(parser, parserResult){
      let data = req.body.data;
      let dialogAnswers = parserResult.dialog.dialog_answer;
      let dialogLine = data.attributes;
      let newMessage = data.attributes.response;
      let object = { _: dialogLine.response,
                     $ : {
                       id : data.id,
                       requirement : dialogLine.requirement,
                       requirementValue : dialogLine.requirementValue,
                       belongsTo: data.relationships['belongs-to'].data.id
                     }
                   };

      parserResult.dialog.dialog_answer.push(object);

    for(index in parserResult.dialog.dialog_line){
      let dialogLine = parserResult.dialog.dialog_line[index].$;
      if(dialogLine.id == data.relationships['belongs-to'].data.id){
        if(dialogLine.answers != null){
          dialogLine.answers += ',';
        }
        dialogLine.answers += data.id
      }
    }
      buildFileFromObject(parserResult, '../../../files/foo.xml', function(){
        res.json(createDialogAnswerObject(object));
      });
    });
  });
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
