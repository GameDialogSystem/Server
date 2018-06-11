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
  return new Promise((resolve, reject) => {
    let id = element.$.id;
    let name = element.$.name;

    let attributes = new Map();
    if (name !== undefined) {
      attributes.set('name', name);
    } else {
      reject({
        errorCode: '004',
        errorMessage: 'You tried to parse an dialog file that does not specify a name.'
      });
    }

    let relationships = new Map();

    // set starting line
    let startingLine = element.$['starting-line'];
    if (startingLine !== undefined) {
      relationships.set("starting-line", emberParser.createEmberObject("dialog-line", startingLine).data);
    }

    // create the actual data element
    const parsedElement = emberParser.createEmberObject('dialog', id, attributes, relationships);
    xmlParser.addParsedElement('dialog', parsedElement);

    resolve(parsedElement);
  });
}

exports.informAboutParsedChildren = function(object, children) {
  object.data.relationships.lines = {
    data: new Array()
  };

  // add each dialog line to the lines relationship and create the
  // relationship to the dialog for each dialog line
  children.forEach(child => {
    console.log(child);
    if (child.data.type === 'dialog-line') {
      object.data.relationships.lines.data.push(child);

      // needed for dialogs with only one dialog line
      if (!child.data.relationships) {
        child.data.relationships = {};
      }

      child.data.relationships['dialog'] = {
        'data': emberParser.convertEmberObjectToEmberRelationship(object)
      };
    }else if(child.data.type === 'meta'){
      object.data.attributes.description = child.data.attributes.description;
    }
  });
}
