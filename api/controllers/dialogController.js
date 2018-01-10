var server = require("../libraries/xmlServer.js");




exports.listAllDialogs = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  var elements = [];
  server.getDialogs().forEach((value, key, map) => {
    elements.push(value.data);
  });

  res.json({ "data" : elements });
}


exports.createDialog = function(req, res) {
  console.log("createDialog");
};

exports.saveDialog = function(req, res) {
  console.log("saveDialog");
};

exports.getDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  server.getDialog(req.params.dialogId).then(dialog => {
    res.json(dialog);
  })
};

exports.updateDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  console.log(req.body);
};

exports.deleteDialog = function(req, res) {

};
