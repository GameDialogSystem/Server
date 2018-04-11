exports.build = function(element) {

  let inputs = "";
  let outputs = "";

  let relationships = element.data.relationships;


  if (relationships !== undefined) {
    if (relationships.outputs !== undefined) {
      outputs = relationships.outputs.data.map((output) => {
        return output.id;
      })
    }

    if (relationships.inputs !== undefined) {
      inputs = relationships.inputs.data.map((input) => {
        return input.id;
      })
    }
  }


  if (element !== undefined) {
    return {
      '$': {
        "id": element.data.id,
        "x": element.data.attributes.x,
        "y": element.data.attributes.y,
        "outputs": outputs,
        "inputs": inputs
      },

      "text": element.data.attributes.message
    }
  }
}
