const xmlParser = require('../libraries/parser/xmlParser.js'),
      pluralize = require('pluralize')

exports.getConnection = (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let connection = xmlParser.getParsedElement("connection", req.params.connectionId);
  const data = connection.data;

  let object = {
    "connection": {
      "id": data.id,
    }
  }

  const relationships = data.relationships;

  if (relationships !== undefined) {
    object.connection["input"] = relationships.input.data.id;
    object.connection["output"] = relationships.output.data.id;
  }

  connection.data.type = "connection";
  res.json(connection);
};

exports.updateConnection = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json(req.body);
};


exports.createConnection = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (pluralize.isPlural(req.body.data.type)) {
    req.body.data.type = pluralize.singular(req.body.data.type);
  }

  const outputId = req.body.data.relationships.output.data.id;

  let output = xmlParser.getParsedElement("output", outputId);

  if (output.included === undefined) {
    output.included = []
    output.included.push(req.body.data);
  }

  output.data.relationships.connection = req.body;


  if(req.body.data.relationships.input){
    req.body.data.relationships.input.data.type = pluralize.singular(req.body.data.relationships.input.data.type).replace('-', '_');
  }

  if(req.body.data.relationships.output){
    req.body.data.relationships.output.data.type = pluralize.singular(req.body.data.relationships.output.data.type).replace('-', '_');
  }

  // update the element within the registry
  //xmlParser.setParsedElement(output.data.type, output.data.id, req.body);

  xmlParser.addParsedElement("connection", req.body);

  res.json(req.body);
}

removeOutput = function(id) {
  const output = xmlParser.getParsedElement("output", id);
  if(!output){
    return;
  }

  const parentDialogLine = xmlParser.getParsedElement("dialog_line", output.data.relationships['belongs-to'].data.id);

  if(parentDialogLine.data.relationships !== undefined){
    let parentOutputs = parentDialogLine.data.relationships.outputs.data;
    const index = parentOutputs.findIndex(_output => {
      return _output.data.id === output.data.id;
    });

    parentOutputs = parentOutputs.splice(index, index + 1);
  }

  xmlParser.removeParsedElement('output', output.data.id);
}

exports.deleteConnection = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const id = req.params.connectionId;
  const connection = xmlParser.removeParsedElement("connection", id);

  if (connection === undefined){
    res.sendStatus(400);
    return;
  }

  const relationships = connection.data.relationships;
  const input = xmlParser.getParsedElement("input", relationships.input.data.id);
  if(input){
    xmlParser.removeParsedElement('input', input.data.id);
  }

  if(relationships.output.data.id){
    removeOutput(relationships.output.data.id);
  }

  if (connection) {
    res.json({
      data: {
        id: id,
        type: 'connection'
      }
    });
  }
};
