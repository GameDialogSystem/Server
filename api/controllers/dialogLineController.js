  var fs = require('fs'),
    xml2js = require('xml2js'),
    server = require('../libraries/xmlServer.js'),
    outputController = require('./outputController.js'),
    uuidv4 = require('uuid/v4'),
    uuidv5 = require('uuid/v5');

var self = this;

exports.createDialogLineEmberObject = function(element){
  let dialogLineID = element.id;
  var followingLines = [];
  if(element.followingLines !== undefined){
    followingLines = element.followingLines.map(function(followingLine, index){

      let successor = server.getDialogLine(followingLine);
      let relationship = (successor.previousLines.find(function(element){
        return (element === dialogLineID);
      }));
      let relationshipIndex = successor.previousLines.indexOf(relationship);

      let outputID = outputController.createID(element.id, index);
      let inputID = "line" + followingLine + "input" + relationshipIndex;
      return outputController.createOutputJSONAPI(outputID, dialogLineID, inputID);
    });

    followingLines.push(outputController.createOutputJSONAPI(outputController.createID(element.id, element.followingLines.length), dialogLineID));
  }else{
    followingLines.push(outputController.createOutputJSONAPI(outputController.createID(element.id, 0), dialogLineID));
  }

  var previousLines = [];
  if(element.previousLines !== undefined){
    previousLines = element.previousLines.map(function(previousLine, index){

        return {
          id : "line" + element.id + "input" + index,
          type : 'input'
        }
    });
  }

  let dialogLine = {
    "data" : {
      "attributes": {
        "message": element.text,
        "x": element.x,
        "y": element.y
      },

      "id": element.id,
      "type": 'dialog-line',


      "relationships": {
        "outputs": {
          "data": followingLines
        },

        "inputs": {
          "data": previousLines
        }
      }
    },

    "included": followingLines.concat(previousLines)
  };

  return dialogLine;
};

exports.createDialogLine = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let id = req.body.data.id;
  let data = req.body.data;
  let message = data.attributes.message.data;
  let x = data.attributes.x;
  let y = data.attributes.y;

  let dialog = server.getDialog(data.relationships.dialog.data.id);

  let followingLinesIDs = [];
  if(data.relationships.followingLines){
    followingLinesIDs = data.relationships.followingLines.data.map(function(followingLine){
      return followingLine.id;
    })
  }

  let previousLinesIDs = [];
  if(data.relationships.previousLines){
    previousLinesIDs = data.relationships.previousLines.data.map(function(previousLine){
      return previousLine.id;
    })
  }


  let dialogLine = server.createDialogLineObject(dialog, {
    "$" : {
      "id" : id,

      "outputs" : followingLinesIDs.join(),
      "inputs" : previousLinesIDs.join(),
    },

    "_" : data.attributes.message,

    belongsToDialog : dialog
  });

  //server.saveDialog(dialog);
  res.json(self.createDialogLineEmberObject(dialogLine));
};

exports.getDialogLine = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialogLine = server.getDialogLine(req.params.dialogLineId);
  res.json(self.createDialogLineEmberObject(dialogLine));
};


exports.updateDialogLine = function(req, res) {
  /*
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD")
  res.header("Access-Control-Allow-Headers", "*");

  var parser = new xml2js.Parser();
    fs.readFile(__dirname + '../../../files/foo.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        let newMessage = req.body.data.attributes.message;

        for(index in result.dialog.dialog_line){
          if(result.dialog.dialog_line[index].$.id == req.params.dialogLineId){
            result.dialog.dialog_line[index]._ = newMessage;

            fs.unlink(__dirname + '../../../files/foo.xml', (err) => {
              if (err) {
                console.log("failed to delete local image:"+err);
              } else {
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result);

                fs.writeFile(__dirname + '../../../files/foo.xml', xml, function(err){
                  if(err){
                  }else{

                    // return json of the desired object
                    res.json({
                      data: {
                        "attributes": {
                          "message": newMessage
                        },
                        "id": req.params.dialogLineId,
                        "type" : "dialog-line",
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
  });
  */
};

exports.deleteDialogLine = function(req, res) {
  /*
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialogLine = server.deleteDialogLine(req.params.dialogLineId);

  res.json({ data : createDialogLineEmberObject(dialogLine) });
  */
};
