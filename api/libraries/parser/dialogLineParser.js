var emberParser = require("./emberDataParser.js");
var connectionParser = require("./connectionParser.js");

var Promise = require("bluebird");

var eventEmitter = undefined;

var self = this;

/**
*
*/
var pendingRelationships = new Map();

exports.registerEventEmitter = function(emitter){
  eventEmitter = emitter;
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

  // set the x coordinate of the position
  let x = element.$.x;
  if(x !== undefined){
    attributes.set('x', x);
  }

  // set the y coordinate of the position
  let y = element.$.y;
  if(y !== undefined){
    attributes.set('y', y);
  }

  // set the alreadySaid attribute of the dialog line
  let alreadySaid = element.$.alreadySaid;
  if(alreadySaid !== undefined){
    attributes.set('alreadySaid', already);
  }

  // set the message of the dialog line
  attributes.set('message', element.text);

  // get possible input ids as an array
  var inputs = undefined;
  if(element.$.inputs !== undefined){
    inputs = element.$.inputs.split(',');
  }

  // get possible output ids as an array
  var outputs = undefined;
  if(element.$.outputs !== undefined){
    outputs = element.$.outputs.split(',');
  }

  // in case the dialog line has defined inputs create the
  // relationship in a JSON API format
  if(inputs !== undefined){
    let inputObjects = inputs.map(input => {
      return emberParser.createEmberObject("input", input).data;
    })

    relationships.set("inputs", inputObjects);
  }

  // in case the dialog line has defined outputs create the
  // relationship in a JSON API format
  if(outputs !== undefined){
    let outputObjects = outputs.map(output => {
      return emberParser.createEmberObject("output", output).data;
    })

    relationships.set("outputs", outputObjects);
  }



    // in case a new element was parsed check if this element is a output
    // or input and verify if this connector belongs to the parsed dialog
    // line. If this is the case set the relationship
    eventEmitter.on('NewParsedElementAdded', object => {
      let belongsToRelationship = emberParser.createEmberObjectRelationship("dialog-line", id);

      var contains = false;

      // check outputs
      if(object.tag === "output" && outputs !== undefined){
        contains = outputs.includes(object.object.data.id);
      }

      // check inputs
      if(object.tag === "input" && inputs !== undefined){
        contains = inputs.includes(object.object.data.id);
      }

      // modify the object directly to set the belongsTo relationship
      if(contains){
        object.object.data.relationships["belongs-to"] = { "data" : belongsToRelationship };
      }
    });



  let emberObject = emberParser.createEmberObject("dialog-line", id, attributes, relationships);
    resolve(emberObject);
  });
}

exports.informAboutParsedChildren = function(children){
}
