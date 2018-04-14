const server = require('../libraries/xmlServer.js'),
    xmlParser = require("../libraries/parser/xmlParser.js"),
    emberDataParser = require("../libraries/parser/emberDataParser.js");

  exports.getDialogLine = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    server.getDialogLine(req.params.dialogLineId).then(dialogLine => {
      const copy = JSON.parse(JSON.stringify(dialogLine));
      const data = copy.data;
      const relationships = Object.assign({}, data.relationships);

      let inputs = [];
      let outputs = [];

      if (relationships !== undefined) {
        if (relationships.inputs) {

          console.log(relationships)
          inputs = relationships.inputs.data.map(input => {
            return emberDataParser.createEmberObject("input", input.data.id).data;
          });

          copy.data.relationships.inputs = {
            "data": inputs
          };
        }

        if (relationships.outputs) {
          outputs = relationships.outputs.data.map(output => {
            return emberDataParser.createEmberObject("output", output.data.id).data;
          });

          copy.data.relationships.outputs = {
            "data": outputs
          };

        }
      }



      res.json(copy);
    });
  };

  exports.updateDialogLine = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    const dialogId = req.body.data.relationships.dialog.data.id;

    const dialogLineData = req.body.data;
    if (dialogId !== undefined) {
      server.getDialog(dialogId).then((result) => {
        // iterate over all dialog lines to find the correct one
        result.data.relationships.lines.data.forEach((line) => {
          if (line.id === dialogLineData.id) {
            server.getDialogLine(line.id).then(dialogLine => {
              // update the message (for now)
              dialogLine.data.attributes.message = dialogLineData.attributes.message;

              // inform server about the made changes
              server.setDialogLine(line.id, dialogLine).then(dialogLine => {
                res.json(dialogLine);
              });
            });
          }
        });

        res.json(req.body);
      }, (error) => {
        res.status(400).json(error);
        return;
      })

    } else {
      res.status(400).send(`you modified a dialog line that is unknown for the server.
      This is most likely a software bug. Please report the problem in order to prevent the error to happening in future
      versions`);
    }
  }

  exports.createDialogLine = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    if(Object.keys(req.body).length === 0 && req.body.constructor === Object){
      res.status(400);
    }

    const data = req.body.data;
    if(data === undefined){
      res.status(400).send();
      return;
    }

    if(data.relationships === undefined){
      res.status(400).send();
      return;
    }

    const dialogId = data.relationships.dialog.data.id;

    data.relationships.dialog = data.relationships.dialog.data;

    if (dialogId !== undefined) {
      server.getDialog(dialogId).then((result) => {
        result.data.relationships.lines.data.push(data);

        xmlParser.addParsedElement("dialog_line", req.body);
      });
    }else{
      res.status(400).send();
      return;
    }

    res.json(req.body);
  }

  exports.deleteDialogLine = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    const id = req.params.dialogLineId;
    const object = xmlParser.removeParsedElement("dialog_line", id);

    if(object === undefined){
      res.status(400).send();
      return;
    }



    const dialog = xmlParser.getParsedElement('dialog', object.data.relationships.dialog.id);

    let relationships = dialog.data.relationships.lines.data;
    if(relationships === undefined){

    }
    const index = relationships.findIndex(dialogLine => {
      return dialogLine.id === id;
    });

    relationships = relationships.splice(index, index+1);


    res.json({ data : {id: req.params.dialogLineId,  type: 'dialog-line'} });
  };
