const dialogLineBuilder = require("./dialogLineBuilder.js"),
  connectionBuilder = require("./connectionBuilder.js");

exports.build = function(element, childs) {
  let xmlElement = {
    '$': {
      "id": element.data.id,
      "name": element.data.attributes.name,
      "starting-line": element.data.relationships['starting-line'].data.id

    }
  }

  childs = element.data.relationships.lines.data.map(line => {
    return dialogLineBuilder.build(line);
  })

  let connections = new Array();
  element.data.relationships.lines.data.forEach(line => {
    if (line.data.relationships.outputs) {
      let bla = line.data.relationships.outputs.data.map(output => {
        return connectionBuilder.build(output.data.relationships.connection);
      });

      connections = connections.concat(connections, bla);
    }
  })

  // filter duplicate connections
  connections = Array.from(new Set(connections));

  let result = Object.assign(xmlElement, {
    'dialog_line': childs
  });

  result = Object.assign(result, {
    'connection': connections
  });

  return result;
}
