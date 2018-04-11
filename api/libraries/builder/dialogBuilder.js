var xml2js = require('xml2js');
var xmlBuilder = new xml2js.Builder();

exports.build = function(element){
  return {
    "dialog" : {
      '$' : {
        "id" : element.data.id,
        "name" : element.data.attributes.name,
        "starting-line" : element.data.relationships['starting-line'].data.id
      }
    }
  }
}
