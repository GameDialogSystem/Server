var elementBuilders = new Map();
var xml2js = require('xml2js');
var fs = require('fs');
var xmlBuilder = new xml2js.Builder();
var xmlParser = require("./../parser/xmlParser.js");
var pluralize = require('pluralize')

exports.registerElementBuilder = function(tag, builder){

  // only allow to define one parser per element
  if(!elementBuilders.has(tag)){
    elementBuilders.set(tag, builder);


    // throw an error in case the user wants to register more than one parser
    // for an element.
  } else {
    throw new Error(`There is already an element parser registered for "${tagName}" elements.`);
  }
}

exports.buildElement = function(element){
  const tag = element.data.type;

  const builder = elementBuilders.get(tag);



  const xmlFormat = builder.build(element);

  Object.keys(element.data.relationships).forEach((key) => {
    let children = (element.data.relationships[key]).data;

    if(children.map !== undefined){
      children.map(child => {
        if(pluralize.isPlural(child.type)){
          child.type = pluralize.singular(child.type);
        }

        const builder = elementBuilders.get(child.type);

        if(builder !== undefined){
          const object = xmlParser.getParsedElement(child.type.replace('-', '_'), child.id);

          return builder.build(object);
        }else{
          return null;
        }
      })

      children.forEach(child => {
        let c = xmlParser.getParsedElement(child.type.replace('-', '_'), child.id);
        if(c !== undefined){
          this.buildElement(c);
        }

      })


      //xmlFormat.dialog.dialog_line = xmlChildren;
    }
/*

*/

  })

  /*
  if(element.data.relationships.lines !== undefined){
    let children = element.data.relationships.lines.data.map(line => {

      // remove the pluralization needed by ember
      if(pluralize.isPlural(line.type)){
        line.type = pluralize.singular(line.type);
      }

      const lineBuilder = elementBuilders.get(line.type);

      const object = xmlParser.getParsedElement(line.type.replace('-', '_'), line.id);
      return lineBuilder.build(object);
    })

    xmlFormat.dialog.dialog_line = children;
  }
  */

  return xmlBuilder.buildObject(xmlFormat);

}

exports.buildFile = function(file, rootElement){
  const result = this.buildElement(rootElement);

  fs.writeFile(file, result, (err) => {
    if(err){
      console.log(err);
    }

    console.log(`file ${file} was successfully saved`);
  })
}
