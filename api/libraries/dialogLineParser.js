var emberParser = require("./emberDataParser.js");
var Promise = require("bluebird");

var events = require('events');
var eventEmitter = new events.EventEmitter();

var lines = new Map();
/**
 * addDialogLine - TODO add functionality to add parsed dialog line elements
 *
 * @param  {type} id description
 * @return {type}    description
 */
addDialogLine = function(dialogLine){
  lines.set(dialogLine);

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
  let id = element.$.id;

  var previousLines = undefined;
  if(element.$.previousLines !== undefined){
    previousLines = element.$.previousLines.split(',');
  }

  var followingLines = undefined;
  if(element.$.followingLines !== undefined){
    followingLines = element.$.followingLines.split(',');
  }


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



  if(followingLines !== undefined){
    let outputArray = followingLines.map(function(line, index){
      return getDialogLine(followingLines[index]);
      // be aware that we ignore the data parent object because we want to return
      // an array of multiple entries.
      //return emberParser.createEmberObject("output", "line"+id+"ouput"+index).data;
    });

    // update the relationships of the dialog line
    Promise.all(outputArray).then(function(values){
      // convert single relationship items to an array of mulitple ones
      let a = values.map(function(lineRelationship){
        return lineRelationship.data;
      });

      console.log(relationships);
    })

    relationships.set('outputs', { "data" : outputArray });


  }

  if(previousLines !== undefined){
    let inputArray = previousLines.map(function(line, index){
      // be aware that we ignore the data parent object because we want to return
      // an array of multiple entries.
      return emberParser.createEmberObject("input", "line"+id+"input"+index).data;
    });

    relationships.set('inputs', { "data" : { inputArray } });
  }



  // finally create the ember data object
  let emberObject = emberParser.createEmberObject("dialog-line", id, attributes, relationships);

  // inform the parser that a dialog line was parsed. This is needed to inform
  // other dialog lines pointing to the parsed dialog line by a relationship
  // like following / previous line
  addDialogLine(emberObject);

  if(emberObject.relationships.outputs)
  console.log(emberObject.relationships.outputs);

  return emberObject;
}
