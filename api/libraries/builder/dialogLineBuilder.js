exports.build = function(element) {
  let inputs = "";
  let outputs = "";

  let relationships = element.data.relationships;

  if (relationships !== undefined) {
    if (relationships.outputs !== undefined) {

      outputs = relationships.outputs.data.map((output) => {
        return output.data.id;
      })
    }

    if (relationships.inputs !== undefined) {
      inputs = relationships.inputs.data.map((input) => {
        return input.data.id;
      })
    }
  }

  if (element !== undefined) {
    let result = {
      '$': {
        "id": element.data.id,
        "x": element.data.attributes.x,
        "y": element.data.attributes.y,
      },

      "text": element.data.attributes.message

    };

    if (outputs) {
      result['$'].outputs = outputs;
    }

    if (inputs) {
      result['$'].inputs = inputs;
    }

    return result;
  }

  return undefined;
}
