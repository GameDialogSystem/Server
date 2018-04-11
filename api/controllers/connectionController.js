let xmlParser = require('../libraries/parser/xmlParser.js');

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
  if (relationships) {
    object.connection["input"] = relationships.input.data.id;
    object.connection["output"] = relationships.output.data.id;
  }

  connection.data.type = "connection";
  res.json(connection);
};

exports.createConnection = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const outputId = req.body.data.relationships.output.data.id;

  let output = xmlParser.getParsedElement("output", outputId);
  if (output.included === undefined) {
    output.included = []
    output.included.push(req.body.data);
  }

  xmlParser.addParsedElement("connection", req.body);

  res.json(req.body);
}

exports.updateConnection = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json(req.body);
}

removeOutput = function(id) {
  const output = xmlParser.getParsedElement("output", id);
  const parentDialogLine = xmlParser.getParsedElement("dialog_line", output.data.relationships['belongs-to'].data.id);

  let parentOutputs = parentDialogLine.data.relationships.outputs.data;
  const index = parentOutputs.findIndex(_output => {
    return _output.data.id === output.data.id;
  });

  parentOutputs = parentOutputs.splice(index, index + 1);

  xmlParser.removeParsedElement('output', output.data.id);
}

exports.deleteConnection = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const id = req.params.connectionId;
  const connection = xmlParser.removeParsedElement("connection", id);
  const relationships = connection.data.relationships;
  const input = xmlParser.getParsedElement("input", relationships.input.data.id);
  xmlParser.removeParsedElement('input', input.data.id);

  removeOutput(relationships.output.data.id);

  if (connection) {
    res.json({
      data: {
        id: id,
        type: 'connection'
      }
    });
  } else {
    res.status(400);
  }
};
