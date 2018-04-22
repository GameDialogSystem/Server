const server = require('../libraries/xmlServer.js'),
    xmlParser = require("../libraries/parser/xmlParser.js"),
    emberDataParser = require("../libraries/parser/emberDataParser.js"),
    pluralize = require('pluralize');

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
          if (line.data.id === dialogLineData.id) {
            server.getDialogLine(line.data.id).then(dialogLine => {
              // update the message (for now)
              dialogLine.data.attributes.message = dialogLineData.attributes.message;

              // inform server about the made changes
              xmlParser.setParsedElement('dialog_line', line.data.id, dialogLine);
              res.json(dialogLine);
            });
          }
        });
      }, (error) => {
        res.status(400).json(error);
        return;
      });
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
    if (dialogId !== undefined) {
      server.getDialog(dialogId).then((result) => {
        if(!result.data.relationships.lines){
          result.data.relationships.lines = {
            data: []
          }
        }

        const id = data.id;
        data.type = pluralize.singular(data.type).replace('-', '_');
        data.relationships.dialog.data.type = pluralize.singular(data.relationships.dialog.data.type);

        result.data.relationships.lines.data.push(req.body);

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
    const dialogLine = xmlParser.removeParsedElement("dialog_line", id);

    if(dialogLine === undefined){
      res.status(400).send();
      return;
    }

    // remove relationship between dialog line and dialog
    if(dialogLine.data.relationships){
      if(dialogLine.data.relationships.dialog){
        const dialog = xmlParser.getParsedElement('dialog', dialogLine.data.relationships.dialog.data.id);

        let relationships = dialog.data.relationships.lines.data;
        const index = relationships.findIndex(dialogLine => {
          return dialogLine.data.id === id;
        });

        relationships = relationships.splice(index, index+1);
        xmlParser.setParsedElement('dialog', dialog.data.id, dialog);

        let dialogLineRelationships = dialogLine.data.relationships;
        if(dialogLineRelationships.inputs){
          dialogLineRelationships.inputs.data.forEach(input => {
            xmlParser.removeParsedElement(input.data.type, input.data.id);
          });
        }

        if(dialogLineRelationships.outputs.data){
          dialogLineRelationships.outputs.data.forEach(output => {
            const outputRelationships = output.data.relationships;
            if(outputRelationships){
              if(outputRelationships.connection){
                const connection = outputRelationships.connection;
                xmlParser.removeParsedElement(connection.data.type, connection.data.id);

                const input = connection.data.relationships.input;
                xmlParser.removeParsedElement(input.data.type, input.data.id);
              }
            }
            xmlParser.removeParsedElement(output.data.type, output.data.id);
          });
        }
      }
    }

    res.json({ data : {id: req.params.dialogLineId,  type: 'dialog-line'} });
  };
