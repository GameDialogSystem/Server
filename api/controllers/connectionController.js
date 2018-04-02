let xmlParser = require('../libraries/parser/xmlParser.js');

exports.getConnection = (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let result = xmlParser.getParsedElement("dialog_line_connection", req.params.connectionId);
  res.json(result);
};

exports.createConnection = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const inputId = req.body.data.relationships.input.data.id;
  const outputId = req.body.data.relationships.output.data.id;
  let output = xmlParser.getParsedElement("output", outputId);
  let input = xmlParser.getParsedElement("input", inputId);

  if(input.data.relationships === undefined){
  input.data.relationships = {};
    input.data.relationships.connection = req.body;
  }

  output.data.relationships.connection = req.body;


  xmlParser.addParsedElement("dialog_line_connection", req.body);

  res.json(req.body);
}
