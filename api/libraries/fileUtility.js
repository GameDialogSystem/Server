var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs'));

exports.readFile = function(file){
    return fs.readFileAsync(file);
}

exports.writeFile = function(file, xml, success, error){
  fs.writeFile(__dirname + file, xml, function(err){
    if(err){
      error(err);
    }else{
      success(xml);
    }
  });
}
