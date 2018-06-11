const emberParser = require("./emberDataParser.js");

exports.parse = function(element){
  return new Promise((resolve, reject) => {
    let attributes = new Map();

    attributes.set('description', element.description[0]);
    const result = emberParser.createEmberObject('meta', undefined, attributes);

    resolve(result);
  });
}

exports.informAboutParsedChildren = function(){

}
