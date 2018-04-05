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

  let dialogLine = xmlParser.getParsedElement("dialog_line", req.body.data.relationships['belongs-to'].data.id);
  if(dialogLine.data.relationships === undefined){
    dialogLine.data.relationships = {}
  }

  if(dialogLine.data.relationships.inputs === undefined){
    dialogLine.data.relationships.inputs = { data : [] };
  }

  dialogLine.data.relationships.inputs.data.push(req.body);


  xmlParser.addParsedElement("input", req.body);
  res.json(req.body);
};


exports.updateInput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.status(200).json(req.body);
}
