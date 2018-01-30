var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = require('fs'),
    path = require('path'),
    resolve = require('path').resolve,
    xml2js = require('xml2js'),
    uuidv4 = require('uuid/v4'),
    uuidv5 = require('uuid/v5'),
    parser = require('./parser/xmlParser.js'),
    builder = require('./builder/xmlBuilder.js');

var directory = resolve(__dirname + '/../../files/');

exports.initialize = function(){
  // register the single element parsers
  parser.registerElementParser('dialog', require('./parser/dialogParser.js'), false);
  parser.registerElementParser('dialog_line', require('./parser/dialogLineParser.js'), true);
  parser.registerElementParser('dialog_line_connection', require('./parser/connectionParser.js'), false);
  parser.registerElementParser('text', require('./parser/textParser.js'), false);
  parser.registerElementParser('condition', require('./parser/conditionParser.js'), false);
  parser.registerElementParser('input', require('./parser/inputParser.js'), false);
  parser.registerElementParser('output', require('./parser/outputParser.js'), false);

  // register the single element builders to create xml files after changing
  // element attributes or adding/deleting of elements
  builder.registerElementBuilder('dialog', require('./builder/dialogBuilder.js'));
  builder.registerElementBuilder('dialog-line', require('./builder/dialogLineBuilder.js'));
  builder.registerElementBuilder('dialog_line_connection', require('./builder/connectionBuilder.js'));
  builder.registerElementBuilder('text', require('./builder/textBuilder.js'));
  builder.registerElementBuilder('condition', require('./builder/conditionBuilder.js'));
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
      parser.parseFile(path.join(directory,"testing.xml")).then(dialog => {
        resolve(dialog);
      }, reason => {
        reject(reason);
      });
    }
  })
}

exports.saveDialog = function(id){
  this.getDialog(id).then(result => {
    builder.buildFile(path.join(directory,"testing.xml"), result)
  });
};


exports.getDialogLine = function(id){
  return new Promise((resolve, reject) => {
    let dialogLine = parser.getParsedElement("dialog_line", id);

    resolve(dialogLine);
  })
}

exports.readAllDialogs = function(){
  let self = this;

  var files = fs.readdirAsync(directory).map(filename => {
    return parser.parseFile(path.join(directory,filename));
  })
}
