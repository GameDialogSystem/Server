const server = require("../libraries/xmlServer.js");
const xmlParser = require("../libraries/parser/xmlParser.js");

exports.listAllDialogs = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  var elements = [];
  server.getDialogs().forEach((value) => {
    elements.push(value.data);
  });

  res.json({ "data" : elements });
}


exports.createDialog = function() {
  console.log("BLUB");
};

exports.saveDialog = function(req, res) {
  res.json(res.body);
};

exports.getDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  server.getDialog(req.params.dialogId).then(dialog => {
    res.json(dialog);
  }, () => {
    res.status(404).send(`file ${req.params.dialogId} does not exist or is not a valid file`);
  })
};

exports.updateDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json(req.body);
};

exports.deleteDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  const object = xmlParser.removeParsedElement("dialog", req.params.dialogId);
  if(object === undefined){
    res.status(400).send();
  }else{
    res.json(object);
  }
};
