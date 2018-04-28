exports.build = function(element) {
  let result = {
    $: {
      id: element.data.id
    }
  }

  if(element.data.relationships){
    if(element.data.relationships.output){
      result['$'].output = element.data.relationships.output.data.id
    }else if (element.data.relationships.outputs){
      result['$'].output = element.data.relationships.outputs.data.id
    }

    if(element.data.relationships.input){
      result['$'].input = element.data.relationships.input.data.id
    }else if (element.data.relationships.inputs){
      result['$'].input = element.data.relationships.inputs.data.id
    }
  }

  return result;
}
