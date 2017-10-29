exports.getInput = function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json({ data : {id: req.params.inputId, x: 0, y: 0, type: 'input'} });
};
