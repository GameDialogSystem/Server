var elementBuilders = new Map(),
    xml2js = require('xml2js'),
    fs = require('fs'),
    xmlBuilder = new xml2js.Builder(),
    xmlParser = require("./../parser/xmlParser.js");

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

exports.buildElement = function(element) {
  const tag = element.data.type;
  const builder = elementBuilders.get(tag);
  const xmlFormat = builder.build(element);

  if (element.data.relationships) {
    if (element.data.relationships.lines) {
      let children = element.data.relationships.lines.data.map(line => {
        const child = xmlParser.getParsedElement(line.type.replace('-', '_'), line.id);

        if (child) {
          return this.buildElement(child);
        }
      })

      xmlFormat["dialog_line"] = children;
    }
  }


  return xmlFormat;
}

exports.buildFile = function(file, rootElement) {
  const result = this.buildElement(rootElement);


  var xml = xmlBuilder.buildObject(result);

  return new Promise((resolve, reject) => {
    fs.writeFile(file, xml, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}
