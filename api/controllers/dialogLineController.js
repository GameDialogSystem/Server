var fs = require('fs'),
    xml2js = require('xml2js'),
    server = require('../libraries/xmlServer.js');

createDialogLineEmberObject = function(element){
  let answers = element.answers.map(function(dialogLineAnswer){
    return { id : dialogLineAnswer.id, type : 'dialog-answer' };
  });

  return {
    "attributes": {
      "message": element.text
    },

    "id": element.id,
    "type" : "dialog-line",

    "relationships": {
      "inputs": {
        "data": [
          { id : '0', type : 'input'}
        ]
      },

      "outputs": {
        "data": answers
      }
    }
  }
};

exports.listAllDialogLines = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialogLine = server.getDialogs().get('1').dialogLines[0];
  res.json({ data : createDialogLineEmberObject(dialogLine) });
};

exports.createDialogLine = function(req, res) {
};

exports.getDialogLine = function(req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let dialogLine = server.getDialogLine(req.params.dialogLineId);
  res.json({ data : createDialogLineEmberObject(dialogLine) });
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

};
