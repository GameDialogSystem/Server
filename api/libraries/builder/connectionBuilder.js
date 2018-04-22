exports.build = function(element) {
  return {

    '$': {
      "id": element.data.id,
      "output": element.data.relationships.output.data.id,
      "input": element.data.relationships.input.data.id

    }
  }
}
