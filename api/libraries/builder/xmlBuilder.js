var elementBuilders = new Map();
var xml2js = require('xml2js');
var xmlBuilder = new xml2js.Builder();
var xmlParser = require("./../parser/xmlParser.js");

exports.registerElementBuilder = function(tag, builder){

  // only allow to define one parser per element
  if(!elementBuilders.has(tag)){
    elementBuilders.set(tag, builder);


    // throw an error in case the user wants to register more than one parser
    // for an element.
  } else {
    throw new Error(`There is already an element parser
      registered for "${tagName}" elements.`);
  }
}

exports.buildElement = function(element){
  let tag = element.data.type;

  let builder = elementBuilders.get(tag);
  let xmlFormat = builder.build(element);

  //console.log(element.data.relationships.lines.data);
  let children = element.data.relationships.lines.data.map(line => {
    let lineBuilder = elementBuilders.get(line.type);

    let object = xmlParser.getParsedElement(line.type.replace('-', '_'), line.id);
    return lineBuilder.build(object);
  })

  xmlFormat.dialog.dialog_line = children;

  return xmlBuilder.buildObject(xmlFormat);
}

exports.buildFile = function(file, rootElement, res){
  let result = this.buildElement(rootElement);
}
