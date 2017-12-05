
/**
* dummy function to create an input model
*/
exports.getOutput = function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json({ data : {id: req.params.outputId, x: 0, y: 0, type: 'output'} });
};

/**
* dummy function to inform ember that the input was successfully deleted from the
* model
*/
exports.deleteOutput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json({ data : {id: req.params.outputId, x: 0, y: 0, type: 'output'} });
};

exports.createID = function(id, index){
  return "line" + id + "output" + index;
};

exports.createOutputJSONAPI = function(id, dialogLineID, connectedInputID){
  var object = {
    "id" : id,
    "type" : "output",

    "relationships" : {
      "belongs-to" : {
        "data" : {
          "id" : dialogLineID,
          "type" : "dialog-line"
        }
      },
    }
  }

  if(connectedInputID !== undefined){
    object.relationships.input = {
      "data" : {
        "id" : connectedInputID,
        "type": "input"
      }
    }
  }

  return object;
}
