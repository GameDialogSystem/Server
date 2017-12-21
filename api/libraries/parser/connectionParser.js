var xmlParser = require("./xmlParser.js");
var emberParser = require("./emberDataParser.js");

let self = this;

exports.connections = new Map();

var eventEmitter = undefined;

exports.registerEventEmitter = function(emitter){
  eventEmitter = emitter;
}

/**
* Parses a connection between two dialog lines from a xml object to
* a JSON API valid object that can be send to the Ember client
*
*/
exports.parse = function(element){
  return new Promise(function(resolve, reject){
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


    let inputObject = emberParser.createEmberObject("input", input, undefined, connectorRelationships);
    let outputObject = emberParser.createEmberObject("output", output, undefined, connectorRelationships);

    // the connection relationships
    let connectionRelationships = new Map();
    connectionRelationships.set("input", inputRelationshipObject);
    connectionRelationships.set("output", outputRelationshipObject);

    // create the final resulting object
    let emberObject = emberParser.createEmberObject("dialog_line_connection", id, attributes, connectionRelationships);

    xmlParser.addParsedElement("input", inputObject);
    xmlParser.addParsedElement("output", outputObject);

    resolve(emberObject);
  });
}
exports.informAboutParsedChildren = function(children){
}
