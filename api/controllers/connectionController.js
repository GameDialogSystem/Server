let parser = require('../libraries/parser/xmlParser.js');

exports.getConnection = function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let result = parser.getParsedElement("dialog_line_connection", req.params.connectionId);
  res.json(result);
};
