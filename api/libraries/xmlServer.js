var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = require('fs'),
    path = require('path'),
    resolve = require('path').resolve,
    xml2js = require('xml2js'),
    uuidv4 = require('uuid/v4'),
    uuidv5 = require('uuid/v5'),
    parser = require('./xmlParser.js');

var directory = resolve(__dirname + '/../../files/');

exports.initialize = function(){
  parser.registerElementParser('dialog', require('./dialogParser.js'), false);
  parser.registerElementParser('dialog_line', require('./dialogLineParser.js'), true);
  parser.registerElementParser('line_connection', require('./connectionParser.js'), true);
  parser.registerElementParser('text', require('./textParser.js'), false);
  parser.registerElementParser('condition', require('./conditionParser.js'), false);
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
      parser.parseFile(path.join(directory,"foo.xml")).then(dialog => {
        resolve(dialog);
      })
    }
  })
}

exports.getDialogLine = function(id){
  return new Promise((resolve, reject) => {
    let dialogLine = parser.getParsedElement("dialog_line", id);

    resolve(dialogLine);
  })
}

exports.readAllDialogs = function(){
  let self = this;

  var files = fs.readdirAsync(directory).map(filename => {

    return parser.parseFile(path.join(directory,filename)); //.then(dialog => {
    //  resolve(dialog);
    //})
  })

  files.then(parsedDialogs => {
    console.log(parser.getAllParsedElementsOfATag("dialog"));
  })
}

exports.addLineToDialog = function(dialog, dialogLine){

}

exports.removeLineFromDialog = function(dialog, dialogLine){

}

exports.updateDialogLine = function(dialogLine, newDialogLine){

}
