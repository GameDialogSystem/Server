const emberParser = require("./emberDataParser.js"),
  xmlParser = require("../parser/xmlParser.js");

/**
 * exports - parses the xml output and creates an Ember model representation
 * of a dialog line in form of a JSON API object.
 *
 * @param  {object} element the xml object that is about to be transformed
 * @return {object}         model representation of a dialog line as a JSON API object
 */
exports.parse = function(element) {
  return new Promise((resolve) => {
    let id = element.$.id;
    let name = element.$.name;


    let attributes = new Map();
    if (name !== undefined) {
      attributes.set('name', name);
    }

    let relationships = new Map();

    if (element.dialog_line !== undefined) {
      const dialogLines = element.dialog_line.map(line => {
        if(line.$ === undefined){
          return null;
        }
        
        return emberParser.createEmberObject("dialog-line", line.$.id).data;
      })


      relationships.set("lines", dialogLines);
    }

    // set starting line
    let startingLine = element.$.startingLine;
    if (startingLine !== undefined) {
      relationships.set("starting-line", emberParser.createEmberObject("dialog-line", startingLine).data);
    }

    const parsedElement = emberParser.createEmberObject("dialog", id, attributes, relationships);
    xmlParser.addParsedElement("dialog", parsedElement);

    resolve(parsedElement);
  });
}

exports.informAboutParsedChildren = function(object, children) {
  object.then(dialog => {
    children.forEach(child => {
      if (child.data !== undefined && child.data.type !== undefined) {
        if (child.data.type === 'dialog-line') {
          child.data.relationships['dialog'] = emberParser.convertEmberObjectToEmberRelationship(dialog);
        }
      }
    });
  })
}
