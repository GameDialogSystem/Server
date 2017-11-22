var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs')),
    path = require('path'),
    resolve = require('path').resolve,
    xml2js = require('xml2js'),
    uuidv4 = require('uuid/v4');

var directory = resolve(__dirname + '/../../files/');

var dialogs = new Map();
var dialogLines = new Map();
var dialogAnswers = new Map();


createDialogObject = function(element){
  let dialog = element.dialog;
  let dialogLines = dialog.dialog_line;
  let lines = [];
  for(index in dialogLines){
    lines[index] = dialogLines[index].$.id;
  }

  return {
    'id' : dialog.$.id,
      'name' : dialog.$.name,
      'startingLine' : dialog.$.startingLine,

      'dialogLines' : []
  }
}

exports.createDialogLineObject = function(dialog, element){
  let dialogLine = {
    'id' : element.$.id,
    'text' : element._,
    'belongsToDialog' : dialog
  };

  if(element.$.inputs !== undefined){
    dialogLine.inputs = element.$.inputs.split(',');
  }

  if(element.$.outputs !== undefined){
    dialogLine.outputs = element.$.outputs.split(',');
  }

  if(element.$.x !== undefined){
    dialogLine.x = element.$.x;
  }

  if(element.$.y !== undefined){
    dialogLine.y = element.$.y;
  }

  dialogLines.set(element.$.id, dialogLine);

  dialog.dialogLines.push(dialogLine);



  return dialogLine;
}

saveDialogLine = function(dialogLine){
  var result = {
      '_' : dialogLine.text,
      '$' : {
        id : dialogLine.id,
        outputs: dialogLine.outputs,
      }
    };

    if(dialogLine.inputs !== undefined){
      result.$.inputs = dialogLine.inputs
    }

    return result;
};

exports.saveDialog = function(dialog){
  let lines = dialog.dialogLines.map(function(dialogLine){
    return saveDialogLine(dialogLine);
  });

  let result = {
    'dialog' : {
      '$' : {
        id: dialog.id,
        name : dialog.name,
        startingLine : dialog.startingLine.id
      },

      'dialog_line' : lines
    }
  };

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(result);

  fileUtil.writeFile('/../../files/foo2.xml', xml, function(){}, function(err){
      console.log("writing file caused this error :" +err);
  });
}

exports.getDialogs = function(){
  return dialogs;
}

exports.getDialog = function(id){
  return dialogs.get(id);
}

exports.getDialogLine = function(id){

  // TODO make this more intelligent. shifting all successors only to push
  // the first dummy element to the back seems inefficient
  let dialogLine = dialogLines.get(id);

  let dummy = dialogLine.outputs.shift();
  dialogLine.outputs.push(dummy);

  return dialogLines.get(id);
}

exports.deleteDialogLine = function(id){
  let dialogLine = this.getDialogLine(id);
  dialogLines.delete(id);

  return dialogLine;
}

exports.getFiles = function(directory){
  return fs.readdirAsync(directory);
}

exports.readAllDialogs = function(){
  let self = this;

  var files = this.getFiles(directory).map(function(filename){
    return fileUtil.readFile(path.join(directory,filename));
  }).then(function(content){
    Promise.map(content, function(item) {
      return xmlUtil.parseStringFromFile(item);
    }).then(function(list){

      list.forEach(function(element){

        var dialog = createDialogObject(element);
        dialogs.set(dialog.id, dialog);

        element.dialog.dialog_line.forEach(function(dialogLine){
          self.createDialogLineObject(dialog, dialogLine);
        });

        dialog.startingLine = dialogLines.get(dialog.startingLine);
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
