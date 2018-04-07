var xmlParser = require("./xmlParser.js");
var emberParser = require("./emberDataParser.js");

exports.connections = new Map();

/**
* Parses a connection between two dialog lines from a xml object to
* a JSON API valid object that can be send to the Ember client
*
*/
exports.parse = function(element){
  return new Promise(function(resolve){
    let id = element.$.id;
    let input = element.$.input;
    let output = element.$.output;

    // we don't need attributes yet for connectors and connections
    // so we create an empty object
    let attributes = {};

    // the relationships of a output pin and a input pin are equal
    // and stored in this object
    let connectionRelationshipObject = emberParser.createEmberObjectRelationship("connection", id);

    // save the relationship to a connection
    let connectorRelationships = new Map();
    connectorRelationships.set("connection", connectionRelationshipObject);

    let inputRelationshipObject = emberParser.createEmberObjectRelationship("input", input);
    let outputRelationshipObject = emberParser.createEmberObjectRelationship("output", output);


    let inputObject = xmlParser.getParsedElement("input", input);
    let outputObject = xmlParser.getParsedElement("output", output);



    // the connection relationships
    let connectionRelationships = new Map();
    connectionRelationships.set("input", inputRelationshipObject);
    connectionRelationships.set("output", outputRelationshipObject);

    // create the final resulting object
    let emberObject = emberParser.createEmberObject("connection", id, attributes, connectionRelationships);

    if(inputObject.data.relationships === undefined){
      inputObject.data.relationships = {}
    }
    inputObject.data.relationships.connection = emberObject;

    if(outputObject.data.relationships === undefined){
      inputObject.data.relationships = {}
    }

    if(outputObject.included === undefined){
      outputObject.included = []
      outputObject.included.push(emberObject.data);
    }

    outputObject.data.relationships.connection = emberObject;


    xmlParser.setParsedElement("input", inputObject.data.id, inputObject);
    xmlParser.setParsedElement("output", outputObject.data.id, outputObject);

    resolve(emberObject);
  });
}
exports.informAboutParsedChildren = function(){
}
