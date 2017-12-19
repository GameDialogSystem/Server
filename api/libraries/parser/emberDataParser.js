

/**
 * exports - description
 *
 * @param  {type} model      description
 * @param  {type} id         description
 * @param  {Map} attributes description
 * @return {type}            description
 */
exports.createEmberObject = function(model, id, attributes, relationships){
  var object = {
    "data" : {
      "id" : id,
      "type": model
    }
  }

  // create an empty object in case there are attributes specified for
  // this model.
  if(attributes !== undefined && attributes.size > 0){
    object.data.attributes = {}

    // add all attributes to the element model
    attributes.forEach(function(value, key, map){
      object.data.attributes[key] = value;
    })
  }

  if(relationships !== undefined && relationships.size > 0){
    object.data.relationships = {}

    relationships.forEach((value, key, map) => {
      object.data.relationships[key] = { "data" : value };
    })
  }

  return object;
}

exports.convertEmberObjectToEmberRelationship = function(emberObject){
  return {
    "data" : {
      "type" : emberObject.data.type,
      id : emberObject.data.id
    }
  }
}
