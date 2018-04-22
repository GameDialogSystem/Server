const common = require ('./tests/common.js');
const expect = common.expect;
const server = common.server;

const createConnectorTestData = function(type) {
  return {
    "data": {
      "id": "test_input",

      "relationships": {
        "connection": {
          "data": {
            "type": "connections",
            "id": "63b44f41-5089-428c-afd3-f01c69012d91"
          }
        },

        "belongs-to": {
          "data": {
            "type": "dialog-lines",
            "id": "2"
          }
        }
      },

      "type": type
    }
  }
}



/**
 * Basic server functionality
 */
describe('Server', function() {


  after(function(done) {
    server.close();

    done();
  });

  describe('Basic Parser Functionality', function() {
    require('./tests/basicFunctionality.js');
  })

  describe('Ember Parser', function() {
    it('Check Include Of Ember Object', function(done) {
      const element = common.emberParser.createEmberObject('model', 1, {}, {}, [""]);

      expect(element).to.be.a('object');
      expect(element).have.property('data');

      expect(element.data).have.property('id');
      expect(element.data.id).to.equal(1);

      done()
    })
  })


  describe('Filesystem', function() {
    require('./tests/filesystem.js');
  })
  //
  // Dialog related test cases
  //
  describe('dialogs', function() {
    require('./tests/dialog.js')
  });


  //
  // DialogLine related test cases
  //
  describe('DialogLine', function() {
    require('./tests/dialogLine');
  })




  //
  // Input related test cases
  //
  describe('Input', function() {
    require('./tests/input')
  })


  //
  // Output related test cases
  //
  describe('Output', function() {
    require('./tests/output')
  })

  //
  // Connection related test cases

  //
  describe('Connection', function() {
    require('./tests/connection')
  })
});
