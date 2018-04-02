let xmlParser = require('../libraries/parser/xmlParser.js'),
    emberDataParser = require("../libraries/parser/emberDataParser.js"),
    pluralize = require('pluralize')
/**
* dummy function to create an input model
*/
exports.getInput = function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let input = xmlParser.getParsedElement("input", req.params.inputId);
  const data = input.data;

  let object = {
    "input": {
      "id": data.id,
    }
  }

  const relationships = data.relationships;
  if(relationships){
    data.relationships.connection = emberDataParser.createEmberObject("connection", relationships.connection.data.id);
  }

  console.log(relationships);


  res.json(input);
};

/**
* dummy function to inform ember that the input was successfully deleted from the
* model
*/
exports.deleteInput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json({ data : {id: req.params.inputId, x: 0, y: 0, type: 'input'} });
};

exports.createInput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if(pluralize.isPlural(req.body.data.type)){
    req.body.data.type = pluralize.singular(req.body.data.type);
  }

  xmlParser.addParsedElement("input", req.body);

  res.json(req.body);
};
