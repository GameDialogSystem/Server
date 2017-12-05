var emberParser = require("./emberDataParser.js");


/**
 * exports - parses the xml output and creates an Ember model representation
 * of a dialog line in form of a JSON API object.
 *
 * @param  {object} element the xml object that is about to be transformed
 * @return {object}         model representation of a dialog line as a JSON API object
 */
exports.parse = function(element, parser){
  let id = element.$.id;
  let name = element.$.name;
  let startingLine = element.$.startingLine;

  var attributes = new Map();
  if(name !== undefined){
    attributes.set('name', name);
  }

  
/*
  // create the relationship to the starting line
  var relationships = new Map();
  relationships.set('startingLine', emberParser.createEmberObject("dialog-line", startingLine));

  // create the ember object
  let emberObject = emberParser.createEmberObject("dialog", id, attributes, relationships);

  return emberObject;
*/
}

exports.parseToXml = function(element){
  let xmlObject = {
    "$" : {
      "id" : element.data.id,
      "name": element.data.name,
      "startingLine" : element.relationships.startingLine.data.id
    }
  }
}
