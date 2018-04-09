let xmlParser = require('../libraries/parser/xmlParser.js'),
  emberDataParser = require("../libraries/parser/emberDataParser.js"),
  pluralize = require('pluralize')

exports.createInput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.body.data === undefined) {
    res.sendStatus(500);
    return;
  }

  if (pluralize.isPlural(req.body.data.type)) {
    req.body.data.type = pluralize.singular(req.body.data.type);
  }

  let dialogLine = xmlParser.getParsedElement("dialog_line", req.body.data.relationships['belongs-to'].data.id);
  if (dialogLine.data.relationships === undefined) {
    dialogLine.data.relationships = {}
  }

  if (dialogLine.data.relationships.inputs === undefined) {
    dialogLine.data.relationships.inputs = {
      data: []
    };
  }

  dialogLine.data.relationships.inputs.data.push(req.body);


  xmlParser.addParsedElement("input", req.body);
  res.json(req.body);
};

/**
 * dummy function to create an input model
 */
exports.getInput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let input = xmlParser.getParsedElement("input", req.params.inputId);
  const data = input.data;

  const relationships = data.relationships;
  if (relationships && relationships.connection) {
    data.relationships.connection = emberDataParser.createEmberObject("connection", relationships.connection.data.id);

    data.relationships['belongs-to'] = {
      'data': data.relationships['belongs-to']
    };
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

  res.json({
    data: {
      id: req.params.inputId,
      type: 'input'
    }
  });
};

exports.updateInput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json(req.body);
}
