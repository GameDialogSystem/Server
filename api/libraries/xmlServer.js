var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs')),
    path = require('path'),
    resolve = require('path').resolve,
    xml2js = require('xml2js');

var directory = resolve(__dirname + '/../../files/');

var dialogs = new Map();
var dialogLines = new Map();
var dialogAnswers = new Map();


createDialogObject = function(element){
  console.log("==============");
  console.log(element);
  console.log("==============");

  let dialog = element.dialog;
  let dialogLines = dialog.dialog_line;
  let lines = [];
  for(index in dialogLines){
    lines[index] = dialogLines[index].$.id;
  }

  return [dialog.$.id, {
    'id' : dialog.$.id,
    'name' : dialog.$.name,
    'startingLine' : dialog.$.startingLine,

    'dialogLines' : [],
    'dialogAnswers' : []
  }];
}

createDialogLineObject = function(dialog, element){
  return [element.$.id, {
    'id' : element.$.id,
    'text' : element._,
    'answers' : [],
    'belongsToDialog' : dialog
  }];
}

createDialogLineAnswerObject = function(element){
  let dialogLine = dialogLines.get(element.$.belongsTo);
  let nextDialogLine = dialogLines.get(element.$.nextLine);
  let dialogAnswer = {
    'id' : element.$.id,
    'text' : element._,
    'requirement' : element.$.requirement,
    'requirementValue' : element.$.requirementValue,
    'nextLine': dialogLines.get(element.$.nextLine),
    'belongsTo': dialogLine
  };



  dialogLine.answers.push(dialogAnswer);

  return [element.$.id, dialogAnswer];
}

saveDialogLine = function(dialogLine){
  let lines = dialogLine.answers.map(function(dialogAnswer){
    return dialogAnswer.id;
  })

  return {
      '_' : dialogLine.text,
      '$' : {
        id : dialogLine.id,
        answers : lines
      }
    };
};

saveDialogAnswer = function(dialogAnswer){
  let result = {
    '_' : dialogAnswer.text,
    '$' : {
      id : dialogAnswer.id,
      requirement : dialogAnswer.requirement,
      requirementValue : dialogAnswer.requirementValue,
      belongsTo : dialogAnswer.belongsTo.id,
      //nextLine : dialogAnswer.nextLine.id
    }
  };

  if(dialogAnswer.nextLine !== undefined){
    result.$['nextLine'] = dialogAnswer.nextLine.id;
  }

  return result;
}

exports.saveDialog = function(dialog){
  let answers = dialog.dialogAnswers.map(function(dialogAnswer){
    return saveDialogAnswer(dialogAnswer);
  });

  let lines = dialog.dialogLines.map(function(dialogLine){
    return saveDialogLine(dialogLine);
  });

  let result = {
    '$' : {
      id: dialog.id,
      name : dialog.name,
      startingLine : dialog.startingLine.id
    },

    'dialog_line' : lines,
    'dialog_answer' : answers
  };

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(result);

  fileUtil.writeFile('../../../files/foo.xml', xml, function(){}, function(){});
}

exports.removeDialogAnswer = function(dialog, dialogAnswer){
  var array = dialog.dialogAnswers;
  var index = array.indexOf(dialogAnswer);
  if (index > -1) {
      array.splice(index, 1);
  }
  dialog.dialogAnswers = array;
  dialogAnswers.delete(dialogAnswer.id);
}

exports.getDialogs = function(){
  return dialogs;
}

exports.getDialog = function(id){
  return dialogs.get(id);
}

exports.getDialogLine = function(id){
  return dialogLines.get(id);
}

exports.getDialogAnswer = function(id){
  return dialogAnswers.get(id);
}

exports.getFiles = function(directory){
  return fs.readdirAsync(directory);
}

exports.readAllDialogs = function(){
  var files = this.getFiles(directory).map(function(filename){
    return fileUtil.readFile(path.join(directory,filename));
  }).then(function(content){
    Promise.map(content, function(item) {
      return xmlUtil.parseStringFromFile(item);
    }).then(function(list){

      list.forEach(function(element){

        var newDialog = createDialogObject(element);
        dialogs.set(newDialog[0], newDialog[1]);

        element.dialog.dialog_line.forEach(function(dialogLine){
          var newDialogLine = createDialogLineObject(newDialog[1], dialogLine);
          dialogLines.set(newDialogLine[0], newDialogLine[1]);

          newDialog[1].dialogLines.push(newDialogLine[1]);
        });

        newDialog[1].startingLine = dialogLines.get(newDialog[1].startingLine);

        element.dialog.dialog_answer.forEach(function(dialogAnswer){
          var newDialogAnswer = createDialogLineAnswerObject(dialogAnswer);
          dialogAnswers.set(newDialogAnswer[0], newDialogAnswer[1]);

          newDialog[1].dialogAnswers.push(newDialogAnswer[1]);
        });
      });
    });
  });

}

exports.addLineToDialog = function(dialog, dialogLine){

}

exports.removeLineFromDialog = function(dialog, dialogLine){

}

exports.updateDialogLine = function(dialogLine, newDialogLine){

}
