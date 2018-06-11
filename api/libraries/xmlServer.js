const Promise = require("bluebird"),
  path = require('path'),
  fs = require('fs'),
  resolve = require('path').resolve,
  builder = require('./builder/xmlBuilder.js'),
  emberParser = require('./parser/emberDataParser.js'),
  parser = require('./parser/xmlParser.js');

exports.directory = resolve(__dirname + '/../../files/');

exports.saveFile = function(object, filename) {
  let dialog = parser.getParsedElement('dialog', object.data.id);

  return builder.buildFile(this.directory + '/' + filename, dialog);
}

exports.getDialogs = function(filteredTags) {
  return new Promise((resolve, reject) => {
  if (!fs.existsSync(this.directory)) {
    console.log("Directory does not exist", this.directory);
    return;
  }

  const files = fs.readdirSync(this.directory);
  let dialogs = new Array();
  files.forEach(file => {
    const stats = fs.lstatSync(path.join(this.directory, file));
    if (!stats.isDirectory() && file.includes('.xml')) {

      dialogs.push(this.getDialog(file, filteredTags));
    }
  })


  Promise.all(dialogs)
    .then(values => {
      resolve(values);
    });
  });
}

exports.getDialog = function(id, filteredTags) {

  return new Promise((resolve, reject) => {
    let dialog = parser.getParsedElement('dialog', id);

    if (dialog) {
      resolve(dialog);
    } else {
      parser.parseFile(path.join(this.directory, id), filteredTags).then(dialog => {
        resolve(dialog);
      }, reason => {
        reject(reason);
      })
    }
  })
}

exports.getDialogLine = function(id) {
  return new Promise((resolve) => {
    let dialogLine = parser.getParsedElement("dialog_line", id);

    resolve(dialogLine);
  })
}

exports.setDialogLine = function(id, object) {
  return new Promise((resolve) => {
    let dialogLine = parser.setParsedElement("dialog_line", id, object);

    resolve(dialogLine);
  })
}
