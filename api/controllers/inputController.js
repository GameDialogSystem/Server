let xmlParser = require('../libraries/parser/xmlParser.js'),
  emberDataParser = require("../libraries/parser/emberDataParser.js"),
  pluralize = require('pluralize')

exports.createInput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let data = req.body.data;

  if (req.body.data === undefined) {
    res.sendStatus(500);
    return;
  }


  if (pluralize.isPlural(data.type)) {
    data.type = pluralize.singular(data.type);
  }

  if(!data.relationships || !data.relationships['belongs-to']){
    res.status(500).json({ errorCode: '007', errorMessage: 'You tried to define an input without a belongsTo relationship to a dialog line.'});
    return;
  }

  data.relationships['belongs-to'].data.type = pluralize.singular(data.relationships['belongs-to'].data.type).replace('-', '_');

  if(data.relationships.connection){
    data.relationships.connection.data.type = pluralize.singular(data.relationships.connection.data.type).replace('-', '_');
  }

  let dialogLine = xmlParser.getParsedElement("dialog_line", data.relationships['belongs-to'].data.id);
  if(!dialogLine){
    res.status(500).json({ errorCode: '010', errorMessage: 'You tried to save an input that belongs to a dialog line that is unknown within the model. Always make sure you save the dialog line first in case you created a new one.'})
    return;
  }

  if(dialogLine.data.relationships.inputs === undefined){
    dialogLine.data.relationships.inputs = {};
    dialogLine.data.relationships.inputs.data = [];
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
  if(!input){
    res.status(500).send('You tried to receive an input that is not known by the current model. This is probably due a wrong or manipulated request.');
    return;
  }

  const data = input.data;
  const relationships = data.relationships;
  if (relationships && relationships.connection) {
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
