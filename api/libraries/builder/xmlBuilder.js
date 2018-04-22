const elementBuilders = new Map(),
  xml2js = require('xml2js'),
  fs = require('fs'),
  builder = new xml2js.Builder({
    'explicitRoot': false,
    'rootName': 'dialog'
  }),
  xmlParser = require("./../parser/xmlParser.js");
var xx = require('xmlbuilder');
const buildElements = new Map();

exports.registerElementBuilder = function(tag, builder) {
  // only allow to define one parser per element
  if (!elementBuilders.has(tag)) {
    elementBuilders.set(tag, builder);


    // throw an error in case the user wants to register more than one parser
    // for an element.
  } else {
    throw new Error(`There is already an element parser registered for "${tag}" elements.`);
  }
}

elementAlreadyBuild = function(element) {
  const id = element.data.id;
  const type = element.data.type.replace('-', '_');

  if (buildElements.has(type)) {
    return buildElements.get(type).includes(id);
  } else {
    return false;
  }
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

exports.buildElement = function(element) {
  const id = element.data.id;
  const tag = element.data.type.replace('-', '_');
  const e = xmlParser.getParsedElement(tag, id);


  let childs = []

  if (buildElements.has(tag)) {
    if (!buildElements.get(tag).includes(id)) {
      buildElements.get(tag).push(id);
    }
  } else {
    buildElements.set(tag, new Array(id));
  }

  if (e.data.relationships) {
    Object.keys(e.data.relationships).forEach(child => {
      let childElement = e.data.relationships[child];

      if (Array.isArray(childElement.data)) {
        childElement.data.forEach(el => {
          if (!elementAlreadyBuild(el)) {
            childs.push(this.buildElement(el));
          }
        })
      } else {
        if (Object.keys(childElement).length !== 2) {
          if (!elementAlreadyBuild(childElement)) {
            childs.push(this.buildElement(childElement));
          }
        }
      }
    });
  }


  const builder = elementBuilders.get(tag);
  if (builder) {
    const result = builder.build(e, childs.clean(undefined));

    return result;
  } else {}

  return undefined;
}

exports.buildFile = function(file, rootElement) {
  const result = this.buildElement(rootElement);

  var xml = builder.buildObject(result);
  return new Promise((resolve, reject) => {
    fs.writeFile(file, xml, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });

  });
}
