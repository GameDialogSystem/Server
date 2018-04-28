var xml2js = require('xml2js'),
  fs = require('fs'),
  Promise = require("bluebird"),
  events = require('events');

var parser = new xml2js.Parser({
  'async': true
});
var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(0);

/**
 * contains all registered element parsers
 */
var _elementParsers = new Map();

/**
 * This map stores for each parsed tag another map containing all parsed elements
 * with the given tag. To retrieve a single element you need to call
 * parseElements.get("tagName").get("id") where tagName is the tag of the wanted
 * element and id the id of it.
 */
var parsedElements = new Map();

exports.clearElements = function() {
  for (const [key, value] of parsedElements) {
    parsedElements.get(key).clear();
  }
}

exports.getParsedElement = function(tag, id) {
  if(!parsedElements.has(tag)){
    return undefined;
  }

  return this.getAllParsedElementsOfATag(tag).get(id);
}

exports.setParsedElement = function(tag, id, object) {
  this.getAllParsedElementsOfATag(tag).set(id, object);
}

exports.getAllParsedElementsOfATag = function(tag) {
  return parsedElements.get(tag);
}

exports.addParsedElement = function(tag, object) {
  this.getAllParsedElementsOfATag(tag).set(object.data.id, object);
}

exports.removeParsedElement = function(tag, objectId) {
  const objects = this.getAllParsedElementsOfATag(tag);
  const object = objects.get(objectId);

  if (object !== undefined && objects.delete(objectId)) {
    return object;
  } else {
    return undefined;
  }
}

/**
 * getElementParser - tries to get a registered parser for the given tag name
 *
 * @param  {string} tagName name that describes the element where you want to
 * get a corresponding parser for
 * @return {type}         a parser for the specified element in case that
 * there is a parser registered for this tag name. Otherwise an error will
 * be thrown
 */
getElementParser = function(tagName) {
  // inform the user that there is an element without a registered parser
  // that cannot be parsed
  if (!_elementParsers.has(tagName)) {
    throw new Error(`There is no element parser registered for elements with the tag name "${tagName}"`);
  } else {
    return _elementParsers.get(tagName);
  }
}


/**
 * exports - tries to load a xml file and parse its content.
 * In order to parse xml elements correctly please use the
 * @see registerElementParser function.
 *
 * @param  {string} file relative path to the xml that is going to be parsed
 * @return {type}      description
 */
exports.parseFile = function(file) {
  let self = this;

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(file)) {
      reject({ errorCode: '003', errorMessage: `You tried to load the file ${file} that does not exist or is not readable.`});
      return;
    }

    fs.readFile(file, (error, data) => {
      if (error){
        reject(error);
      }

      parser.parseString(data, (error, result) => {
        if (error) throw error;

        let tag = Object.keys(result)[0];

        self.parseElement(tag, result[tag]).then(element => {
          resolve(element);
        }, reason => {
          reject(reason);
        });
      });
    });
  });
}


/**
 * exports - parses recursively a single xml element if there is a registered
 * parser for the element. Otherwise an error will be thrown
 *
 * @param {string} tag the tag name of the element. This is used to get the
 * correct parser for an element
 * @param  {object} element the element you want to parse in form of an object
 * @return {type}         description
 */
exports.parseElement = function(tag, element) {
  let self = this;

  if (typeof element === "string") {
    return new Promise.resolve(element);
  }

  return new Promise((resolve, reject) => {
    var keys = Object.keys(element);

    keys.splice(keys.indexOf('$'), 1);

    let elementParser = null;
    try {
      elementParser = getElementParser(tag);
    } catch (e) {
      reject(e.message);
    }

    let object = elementParser.parse(element, this);
    object.then(function(value){
      var children = [];

      keys.forEach((key) => {
        if (Array.isArray(element[key])) {
          element[key].forEach((child) => {
            children.push(self.parseElement(key, child, resolve, reject));
          })
        }
      });

      Promise.all(children).then(children => {
        elementParser.informAboutParsedChildren(value, children);

        self.getAllParsedElementsOfATag(tag).set(value.data.id, value);

        resolve(value);
      }, (reason) => {
        reject(reason);
      })
    }, function(reason){
      reject(reason);
    });
  });
}


/**
 * validateElementParser - validates if a parser contains the needed
 * functionality to successfully parse elements. Be aware that this
 * method only checks if the module has the needed methods. The
 * functionality of these is not validated
 *
 * @return {boolean} true in case the parser contains the methods
 * parse and informAboutParsedChildren
 */
validateElementParser = function(parser) {
  let hasParse = typeof parser.parse === "function";
  let hasRegisterEventEmitter = typeof parser.informAboutParsedChildren === "function";

  return hasParse && hasRegisterEventEmitter;
}


/**
 * registerElementParser - registers a parser that will be used to parse xml elements based
 * on the given tag name.
 *
 * @param  {string} tagName defines the tag name of the element for that the
 * parser called each time an element with that tag name is about to be parsed
 * @param  {type} parser  description
 * @param  {boolean} registerEventEmitter if set to true (default value) the
 * event emmiter of this parser is added to the element parser that is about
 * to be registered. This can be handy in case you want to inform parsers
 * about events that happened before.
 * @return {type}         description
 */
exports.registerElementParser = function(tagName, parser, registerEventEmitter) {
  // register the event emitter
  if (registerEventEmitter === undefined || registerEventEmitter === true) {
    parser.registerEventEmitter(eventEmitter);
  }

  // check if the parser implements the needed functionality, reject if not
  if (!validateElementParser(parser)) {
    throw new Error(`The parser tried to register for the element "${tagName}" does not contain the methods parse and/or informAboutParsedChildren.`)
  }

  // only allow to define one parser per element
  if (!_elementParsers.has(tagName)) {
    _elementParsers.set(tagName, parser);

    // add a map to store parsed elements to make them accessable afterwards
    parsedElements.set(tagName, new Map());
    // throw an error in case the user wants to register more than one parser
    // for an element.
  } else {
    throw new Error(`There is already an element parser registered for "${tagName}" elements.`);
  }
}
