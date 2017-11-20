  var fs = require('fs'),
    xml2js = require('xml2js'),
    server = require('../libraries/xmlServer.js'),
    uuidv4 = require('uuid/v4'),
    uuidv5 = require('uuid/v5');

var self = this;

exports.createDialogLineEmberObject = function(element){

  let outputs = element.successors.map(function(output){
      return {
        id : uuidv4(),
        type : 'output'
      }
  });

  // create an empty output to allow new dialog line connections
  outputs.push({
    id : uuidv4(),
    type : 'output'
  })

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
          "data": outputs
        }
      }
    },

    "included": outputs
  };

  return dialogLine;
};

exports.listAllDialogLines = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  //let dialogLine = server.getDialogs().get('1').dialogLines[0];
  //res.json({ data : createDialogLineEmberObject(dialogLine) });
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


  let dialogLine = server.createDialogLineObject(dialog, {
    $ : {
      id : id
    },

    _ : data.attributes.message,

    belongsToDialog : dialog
  });

  console.log(dialogLine);

  server.saveDialog(dialog);

  res.json(createDialogLineEmberObject(dialogLine));
};

exports.getDialogLine = function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialogLine = server.getDialogLine(req.params.dialogLineId);
  res.json(self.createDialogLineEmberObject(dialogLine));
};

exports.updateDialogLine = function(req, res) {
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
};

exports.deleteDialogLine = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialogLine = server.deleteDialogLine(req.params.dialogLineId);

  res.json({ data : createDialogLineEmberObject(dialogLine) });
};
