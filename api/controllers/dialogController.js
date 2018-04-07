const server = require("../libraries/xmlServer.js");

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

};

exports.saveDialog = function(req, res) {
  res.json({ "data" : elements });
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

exports.deleteDialog = function() {

};
