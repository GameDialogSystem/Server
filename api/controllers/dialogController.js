var server = require("../libraries/xmlServer.js");




exports.listAllDialogs = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json({ "data": "Hello" });
}


exports.createDialog = function(req, res) {
};

exports.getDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");


  server.getDialog(req.params.dialogId).then(dialog => {
    console.log(dialog);
    res.json(dialog);    
  })
};

exports.updateDialog = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
};

exports.deleteDialog = function(req, res) {

};
