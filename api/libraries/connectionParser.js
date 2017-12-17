var dialogLineParser = require("./dialogLineParser.js");
var emberParser = require("./emberDataParser.js");

let self = this;

exports.connections = new Map();

var eventEmitter = undefined;

exports.registerEventEmitter = function(emitter){
  eventEmitter = emitter;
}

addDialogLineConnection = function(dialogLine){
  self.connections.set(dialogLine.data.id, dialogLine);
  eventEmitter.emit('addDialogLineConnection', dialogLine);
}

exports.parse = function(element){
  // wait for both dialog lines to be parsed
  //
  return new Promise(function(resolve, reject){
    let id = element.$.id;
    let input = element.$.input;
    let output = element.$.output;

    let incomingDialogLine = dialogLineParser.lines.get(input);
    let outgoingDialogLine = dialogLineParser.lines.get(output);

    if(incomingDialogLine !== undefined && outgoingDialogLine !== undefined){

    }

    let attributes = {};
    let relationships = {};

    let emberObject = emberParser.createEmberObject("dialog-connection", id, attributes, relationships);
    addDialogLineConnection(emberObject);

    resolve(emberObject);
  });
}
exports.informAboutParsedChildren = function(children){
}
