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

      if (relationships) {
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

  exports.updateDialogLine = (req, res) => {
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
              //dialogLine.data.relationships = dialogLineData.relationships;

              // inform server about the made changes
              server.setDialogLine(line.id, dialogLine).then(dialogLine => {
                res.json(dialogLine);
              });
            });
          }

        });
      }, (error) => {
        res.json(error);
      })

    } else {
      res.status(404).send(`you modified a dialog line that is unknown for the server.
      This is most likely a software bug. Please report the problem in order to prevent the error to happening in future
      versions`);
    }


    res.json(req.body);
  }

  exports.createDialogLine = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    const dialogId = req.body.data.relationships.dialog.data.id;

    const dialogLineData = req.body.data;
    if (dialogId !== undefined) {
      server.getDialog(dialogId).then((result) => {
        result.data.relationships.lines.data.push(dialogLineData);

        xmlParser.addParsedElement("dialog_line", req.body);
      });
    }

    res.json(req.body);
  }
