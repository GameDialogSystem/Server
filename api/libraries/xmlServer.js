const Promise = require("bluebird"),
      path = require('path'),
      resolve = require('path').resolve,
      builder = require('./builder/xmlBuilder.js'),
      parser = require('./parser/xmlParser.js');


exports.directory = resolve(__dirname + '/../../files/');

exports.saveFile = function(object, filename) {
  let dialog = parser.getParsedElement('dialog', object.data.id);

  return builder.buildFile(this.directory + '/' + filename, dialog);
}

exports.getDialogs = function(){
  return parser.getAllParsedElementsOfATag('dialog');
}

exports.getDialog = function(id){
  return new Promise((resolve, reject) => {
    let dialog = parser.getParsedElement('dialog', id);

    if(dialog !== undefined){
      resolve(dialog);
    }else{   
      parser.parseFile(path.join(this.directory, id)).then(dialog => {
        resolve(dialog);
      }, reason => {
        reject(reason);
      })
    }
  })
}

exports.getDialogLine = function(id){
  return new Promise((resolve) => {
    let dialogLine = parser.getParsedElement("dialog_line", id);

    resolve(dialogLine);
  })
}

exports.setDialogLine = function(id, object){
  return new Promise((resolve) => {
    let dialogLine = parser.setParsedElement("dialog_line", id, object);

    resolve(dialogLine);
  })
}
