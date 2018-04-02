let xmlParser = require('../libraries/parser/xmlParser.js'),
    pluralize = require('pluralize')
/**
* dummy function to create an input model
*/
exports.getInput = function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let result = xmlParser.getParsedElement("input", req.params.inputId);

  res.json(result);
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

  xmlParser.addParsedElement("input", req.body, false);

  res.json(req.body);
};
