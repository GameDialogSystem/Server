var emberParser = require("./emberDataParser.js");
var connectionParser = require("./connectionParser.js");

var Promise = require("bluebird");

var eventEmitter = undefined;


exports.lines = new Map();

var self = this;

/**
*
*/
var pendingRelationships = new Map();

exports.registerEventEmitter = function(emitter){
  eventEmitter = emitter;
}

/**
 * addDialogLine - TODO add functionality to add parsed dialog line elements
 *
 * @param  {type} id description
 * @return {type}    description
 */
addDialogLine = function(dialogLine){
  self.lines.set(dialogLine.data.id, dialogLine);
  eventEmitter.emit('addDialogLine', dialogLine);
}



/**
 * getDialogLine - description
 *
 * @param  {type} index description
 * @return {type}       description
 */
getDialogLine = function(index){
  // create a promise to wait for another dialog line to be parsed
  return new Promise(function(resolve, reject){

    // the promise waits for an event that is triggered each time a dialog line
    // was parsed. The event compares the id of the searched dialog line with
    // the one that was parsed. In case they are equal the promise will be
    // marked as resolved
    eventEmitter.on('addDialogLine', function(dialogLine){
      if(dialogLine.data.id === index){
        resolve(dialogLine);
      }
    });

    // TODO we need an event in case the requested dialog line is not part of
    // the dialog and therefore we need to mark the promise as rejected
  }).then(function(dialogLine){
    return emberParser.convertEmberObjectToEmberRelationship(dialogLine);
  });
}


/**
 * exports - description
 *
 * @param  {type} element description
 * @return {type}         description
 */
exports.parse = function(element){
  return new Promise(function(resolve, reject){
  let id = element.$.id;

  var attributes = new Map();
  var relationships = new Map();

  let x = element.$.x;
  if(x !== undefined){
    attributes.set('x', x);
  }

  let y = element.$.y;
  if(y !== undefined){
    attributes.set('y', y);
  }

  let alreadySaid = element.$.alreadySaid;
  if(alreadySaid !== undefined){
    attributes.set('alreadySaid', already);
  }

  attributes.set('message', element.text);



  var outgoings = undefined;
  if(element.$.outgoings !== undefined){

    outgoings = element.$.outgoings.split(',');

    outgoings = outgoings.map(function(connection){
      return {
        "id" : "line" + id + "output"+connection,
        "type" : "output"
      };
    });

    relationships.set("outputs", outgoings);
  }


  var incomings = undefined;
  if(element.$.incomings !== undefined){

    incomings = element.$.incomings.split(',');

    incomings = incomings.map(function(connection){
      return {
        "id" : "line" + id + "input"+connection,
        "type" : "input"
      };
    });

    relationships.set("inputs", incomings);
  }


  let emberObject = emberParser.createEmberObject("dialog-line", id, attributes, relationships);

  resolve(emberObject);



  //return emberObject;
  });
}

exports.informAboutParsedChildren = function(children){
}
