const Promise = require("bluebird"),
      path = require('path'),
      resolve = require('path').resolve,
      parser = require('./parser/xmlParser.js');


const directory = resolve(__dirname + '/../../files/');

exports.initialize = function(){
  // register the single element builders to create xml files after changing
  // element attributes or adding/deleting of elements


  parser.getEventEmitter().on('NewParsedElementAdded', () => {
    saveFile(this.getDialogs().entries().next().value[0]);
  });
}
exports.getParser = function(){
  return parser;
}

saveFile = (object) => {
  this.getDialog(object).then(result => {
    builder.buildFile(path.join(directory,"testing_blub.xml"), result)
  })
}

exports.getDialogs = function(){
  return parser.getAllParsedElementsOfATag("dialog");
}

exports.getDialog = function(id){
  return new Promise((resolve, reject) => {
    let dialog = parser.getParsedElement("dialog", id);

    if(dialog !== undefined){
      resolve(dialog);
    }else{
      parser.parseFile(path.join(directory, id)).then(dialog => {
        resolve(dialog);
      }, reason => {
        reject(reason);
      });
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
