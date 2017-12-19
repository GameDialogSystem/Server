exports.build = function(element){
  console.log(element);

  if(element !== undefined){
  return {
    '$' : {
      "id" : element.data.id,
      "x" : element.data.attributes.x,
      "y" : element.data.attributes.y
    },

    "text" : element.data.attributes.message
  }
}
}
