let xmlParser = require('../libraries/parser/xmlParser.js'),
  emberDataParser = require("../libraries/parser/emberDataParser.js"),
  pluralize = require('pluralize')

exports.createOuput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  const data = req.body.data;

  if (data === undefined) {
    res.status(500).json({ errorCode: '008', errorMessage: 'You tried to add an output to the dialog without any data. This is not allowed.'})
    return;
  }


  if (pluralize.isPlural(req.body.data.type)) {
    req.body.data.type = pluralize.singular(req.body.data.type);
  }

  if(!req.body.data.relationships || !req.body.data.relationships['belongs-to']){
    res.status(500).json({ errorCode: '001', errorMessage: 'You tried to define an output without a belongsTo relationship to a dialog line.'});
    return;
  }

  let dialogLine = xmlParser.getParsedElement("dialog_line", req.body.data.relationships['belongs-to'].data.id);

  if(dialogLine.data.relationships.outputs === undefined){
    dialogLine.data.relationships.outputs = {};
    dialogLine.data.relationships.outputs.data = [];
  }

  dialogLine.data.relationships.inputs.data.push(req.body);

  xmlParser.addParsedElement("input", req.body);

  res.json(req.body);
};

/**
 * dummy function to create an output model
 */
exports.getOutput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let output = xmlParser.getParsedElement("output", req.params.outputId);
/*
  const data = output.data;

  const relationships = data.relationships;
  if (relationships && relationships.connection) {
    data.relationships.connection = emberDataParser.createEmberObject("connection", relationships.connection.data.id);

    data.relationships['belongs-to'] = {
      'data': data.relationships['belongs-to']
    };
  }
*/
  res.json(output);
};

/**
 * dummy function to inform ember that the output was successfully deleted from the
 * model
 */
exports.deleteOutput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json({
    data: {
      id: req.params.outputId,
      type: 'output'
    }
  });
};

exports.updateOutput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json(req.body);
}
