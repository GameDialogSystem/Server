const fs = require('fs'),
  os = require('os'),
  path = require('path'),
  Promise = require("bluebird");


dirTree = function(folder) {
  return new Promise((resolve) => {
    return fs.readdir(folder, (err, content) => {

      files = content.map((fileName) => {
        const stat = fs.statSync(folder + "/" + fileName);
        const extension = path.extname(fileName);

        return {
          lastAccessTimestamp: stat.atimeMs,
          lastModifiedTimestamp: stat.mtimeMs,
          lastChangedTimestamp: stat.ctimeMs,
          fileName: fileName.replace(extension, ''),
          extension: extension.replace('.', ''),
          isFile: stat.isFile(),
          isDirectory: stat.isDirectory()

        }
      })

      const result = files.sort((a, b) => {
        return a.fileName.localeCompare(b.fileName);
      })

      resolve(result);
    })
  })
}

exports.getFiles = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let path = req.params.path.replace(/\+/g, '/');

  if (path == "null") {
    path = "";
  }


  dirTree(os.homedir() + '/' + path).then(files => {
    res.json(files);
  })
};
