const fs = require('fs'),
os = require('os'),
path = require('path');

var Promise = require("bluebird");
var join = Promise.join;

dirTree = function(folder) {
  return fs.readdirAsync(folder).map(function(fileName) {
    const stat = fs.statAsync(folder + "/" + fileName);
    const extension = path.extname(fileName);

    return join(stat, function(stat, contents) {
      return {
        lastAccessTimestamp: stat.atimeMs,
        lastModifiedTimestamp: stat.mtimeMs,
        lastChangedTimestamp: stat.ctimeMs,
        fileName: fileName.replace(extension, ''),
        extension: extension.replace('.', ''),
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory()
      }
    });
  }).call("sort", function(a, b) {
    return a.fileName.localeCompare(b.fileName);
  })
}


exports.getFiles = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let path = req.params.path.replace(/\+/g,'/');

  if(path == "null"){
    path = "";
  }

  dirTree(os.homedir() + '/' + path).then(result => {
   res.json(result);
  })
};
