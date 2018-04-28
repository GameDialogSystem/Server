const server = require("../libraries/xmlServer.js");
const xmlParser = require("../libraries/parser/xmlParser.js");
const emberParser = require("../libraries/parser/emberDataParser.js");

exports.listAllDialogs = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  var elements = [];
  server.getDialogs().forEach((value) => {
    elements.push(value.data);
  });

  res.json({ "data" : elements });
}


exports.saveDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json(res.body);
};

exports.getDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  xmlParser.clearElements();
  server.getDialog(decodeURIComponent(req.params.dialogId)).then(dialog => {
    let deepCopy = JSON.parse(JSON.stringify(dialog));
    let lines = deepCopy.data.relationships.lines;

    lines.data = lines.data.map(a => {
      return emberParser.convertEmberObjectToEmberRelationship(a);
    })

    res.json(deepCopy);
  }, (error) => {
    res.status(500).json(error)
  });
};

exports.updateDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  server.saveFile(req.body, req.body.data.id);

  res.json(req.body);
};

exports.deleteDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const object = xmlParser.removeParsedElement('dialog', req.params.dialogId);
  if(object === undefined){
    res.status(400).send();
  }else{
    res.json(object);
  }
};
