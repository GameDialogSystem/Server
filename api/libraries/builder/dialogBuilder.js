exports.build = function(element){

  return {
    "dialog" : {
      '$' : {
        "id" : element.data.id,
        "type" : element.data.type,
        "name" : element.data.attributes.name
      },
    }
  }
}
