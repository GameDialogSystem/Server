const emberParser = require("./emberDataParser.js");
const xmlParser = require('../parser/xmlParser.js');
const Promise = require("bluebird");

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
  return new Promise(function(resolve){
    const id = element.$.id;

    let attributes = new Map();
    let relationships = new Map();

    // set the x coordinate of the position
    const x = element.$.x;
    if(x !== undefined){
      attributes.set('x', x);
    }

    // set the y coordinate of the position
    const y = element.$.y;
    if(y !== undefined){
      attributes.set('y', y);
    }

    // set the alreadySaid attribute of the dialog line
    const alreadySaid = element.$.alreadySaid;
    if(alreadySaid !== undefined){
      attributes.set('alreadySaid', already);
    }

    // set the message of the dialog line
    attributes.set('message', element.text);

    // get possible input ids as an array
    let inputs = undefined;
    if(element.$.inputs !== undefined){
      inputs = element.$.inputs.split(',');
    }

    // get possible output ids as an array
    let outputs = undefined;
    if(element.$.outputs !== undefined){
      outputs = element.$.outputs.split(',');
    }

    // in case the dialog line has defined inputs create the
    // relationship in a JSON API format
    if(inputs !== undefined){
      let inputObjects = inputs.map(input => {
        let inputObject = emberParser.createEmberObject("input", input);
        xmlParser.addParsedElement("input", inputObject);
        return inputObject;
      })

      relationships.set('inputs', inputObjects);
    }

    // in case the dialog line has defined outputs create the
    // relationship in a JSON API format
    if(outputs !== undefined){
      const outputObjects = outputs.map(output => {
        let outputObject = emberParser.createEmberObject("output", output);
        xmlParser.addParsedElement("output", outputObject);


        return outputObject;
      })

      relationships.set('outputs', outputObjects);
    }


    let emberObject = emberParser.createEmberObject("dialog-line", id, attributes, relationships);

    if(relationships.get("outputs")){
      relationships.get("outputs").forEach(output => {
        output.data.relationships = {}
        output.data.relationships["belongs-to"] = emberParser.convertEmberObjectToEmberRelationship(emberObject);

        xmlParser.setParsedElement("output", output.data.id, output);
      })
    }

    if(relationships.get("inputs")){
      relationships.get("inputs").forEach(input => {
        input.data.relationships = {}
        input.data.relationships["belongs-to"] = emberParser.convertEmberObjectToEmberRelationship(emberObject);

        xmlParser.setParsedElement("input", input.data.id, input);
      })
    }

    resolve(emberObject);
  });
}

exports.informAboutParsedChildren = function(){
}
