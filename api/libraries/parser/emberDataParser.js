

/**
 * exports - description
 *
 * @param  {type} model      description
 * @param  {type} id         description
 * @param  {Map} attributes description
 * @return {type}            description
 */
exports.createEmberObject = function(model, id, attributes, relationships, includes){
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
    attributes.forEach((value, key) => {
      object.data.attributes[key] = value;
    })
  }

  if(relationships !== undefined && relationships.size > 0){
    object.data.relationships = {}

    relationships.forEach((value, key) => {
      object.data.relationships[key] = { "data" : value };
    })
  }

  if(includes !== undefined){
    object.includes = [];

    includes.forEach((value) => {
      object.includes.pushBack(value);
    })
  }

  return object;
}

exports.createEmberObjectRelationship = function(model, id){
  return {
      "type" : model,
      id : id
  }
}

exports.convertEmberObjectToEmberRelationship = function(emberObject){
  return this.createEmberObjectRelationship(emberObject.data.type, emberObject.data.id);
}
