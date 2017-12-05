var xml2js = require('xml2js'),
    fs = require('fs');

var parser = new xml2js.Parser({'async': true});


/**
 * contains all registered element parsers
 */
var _elementParsers = new Map();


/**
 * getElementParser - tries to get a registered parser for the given tag name
 *
 * @param  {string} tagName name that describes the element where you want to
 * get a corresponding parser for
 * @return {type}         a parser for the specified element in case that
 * there is a parser registered for this tag name. Otherwise an error will
 * be thrown
 */
getElementParser = function(tagName){
    // inform the user that there is an element without a registered parser
    // that cannot be parsed
    if(!_elementParsers.has(tagName)){
        throw new Error(`There is no element parser registered
        for elements with the tag name "${tagName}"`);
    }else{
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
exports.parseFile = function(file, res){
    let a = fs.readFile(file, (error, data) => {
        if (error) throw error;

        // parse the xml file
        let result = parser.parseString(data, (error, result) => {
            if(error) throw error;

            let tag = Object.keys(result)[0];
            let element = this.parseElement(tag, result[tag]);
        });

        res.send(result);
    })
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
exports.parseElement = function(tag, element){
    let self = this;

    // only parse objects and ignore text elements
    try{
        // try to get a parser for the element
        let elementParser = getElementParser(tag);

        // only parse single elements. See else branch for handling multiple
        // elements for one tag name
        if(!Array.isArray(element)){
            // parse the element
            let object = elementParser.parse(element, this);

            // parse only non-text children
            if(typeof element === 'object'){

                // parse all contained children within the element
                Object.keys(element).forEach(function(key){
                    // only continue with recursively
                    // parsing with non-text xml elements
                    if(key !== '$' && key !== '_'){
                        self.parseElement(key, element[key]);
                    }
                })
            }
        }else{
            //console.log(tag);

            // break array apart and call the parseElement function for each
            // array element
            element.forEach(function(arrayElement){
                self.parseElement(tag, arrayElement);
            })
        }
    } catch(e) {
        //console.log("ERROR");
        console.log(e);
    }
}


/**
 * exports - registers a parser that will be used to parse xml elements based
 * on the given tag name.
 *
 * @param  {string} tagName defines the tag name of the element for that the
 * parser called each time an element with that tag name is about to be parsed
 * @param  {type} parser  description
 * @return {type}         description
 */
exports.registerElementParser = function(tagName, parser){
    // only allow to define one parser per element
    if(!_elementParsers.has(tagName)){
        _elementParsers.set(tagName, parser);

    // throw an error in case the user wants to register more than one parser
    // for an element.
    } else {
        throw new Error(`There is already an element parser
        registered for "${tagName}" elements.`);
    }
}
