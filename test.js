const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const parser = require('./api/libraries/parser/xmlParser.js');
const emberParser = require('./api/libraries/parser/emberDataParser.js');

chai.use(chaiHttp);

/**
 * Basic server functionality
 */
describe('Server', function() {
  var server;
  beforeEach(function() {
    server = require('./server');
  });
  afterEach(function() {
    server.close();
  });

  describe('Basic Parser Functionality', function() {
    it('Add Invalid Parser', function() {
      const name = 'element';
      chai.expect(() => parser.registerElementParser(name, function(){}, false)).to.throw(`The parser tried to register for the element "${name}" does not contain the methods parse and/or informAboutParsedChildren.`)
    })

    it('Add Multiple Parser For Same Element', function() {
      const name = 'element';
      const parserPath = './api/libraries/parser/';

      parser.registerElementParser(name, require(parserPath + 'dialogLineParser.js'));
      chai.expect(() => parser.registerElementParser(name, require(parserPath + 'dialogLineParser.js'))).to.throw(`There is already an element parser registered for "${name}" elements.`);
    })

    it('Get Not Known Parser For Element', function() {
      chai.expect(() => parser.parseElement('unknown_element', {'$': { id: '1', input: 'i1', output: 'o1' }}).to.throw(`There is no element parser registered for elements with the tag name "${name}"`));
    })
  })

  describe('Ember Parser', function() {
    it('Check Include Of Ember Object', function() {
      const element = emberParser.createEmberObject('model', 1, {}, {}, [""]);

      expect(element).to.be.a('object');
      expect(element).have.property('data');

      expect(element.data).have.property('id');
      expect(element.data.id).to.equal(1);
    })
  })



  //
  // Dialog related test cases
  //
  describe('Dialog', function() {
    describe('Create', function() {
      it('DIA_001', function() {

      })
    })

    describe('Get', function() {
      it('DIA_002', function(done) {
        chai.request(server)
          .get('/dialogs/testing.xml')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('testing.xml');

            expect(res.body.data).have.property('attributes');
            expect(res.body.data.attributes).to.be.a('object');
            expect(res.body.data.attributes.name).to.be.equal('Bunny Dialog');

            expect(res.body.data).have.property('relationships');
            expect(res.body.data.relationships).to.be.a('object');
            expect(res.body.data.relationships).to.have.property('lines');
            expect(res.body.data.relationships.lines).to.have.property('data');
            expect(res.body.data.relationships.lines.data).to.be.a('array');
            expect(res.body.data.relationships.lines.data.length).to.be.equal(2);

            expect(res.body.data.relationships).to.have.property('starting-line');

            done();
          });
      })

      it('DIA_006', function(done) {
        chai.request(server)
          .get('/dialogs/testing_blub.xml')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('testing.xml');

            expect(res.body.data).not.to.have.property('attributes');

            expect(res.body.data).not.to.have.property('relationships');

            done();
          });
      })

      it('DIA_008', function(done) {
        chai.request(server)
          .get('/dialogs/invalid_file.xml')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            done();
          });
      })

      it('DIA_009', function(done) {
        chai.request(server)
          .get('/dialogs/not_existing_file.xml')
          .end(function(err, res) {
            expect(res).to.have.status(404);

            done();
          });
      })
    })

    describe('Get All', function() {
      it('DIA_003', function() {

      })
    })

    describe('Change', function() {
      it('DIA_004', function() {

      })
    })

    describe('Delete', function() {
      before(function(done) {
        chai.request(server)
          .get('/dialogs/testing.xml')
          .end(function(err, res) {
            done();
          });
      })
      it('DIA_005', function(done) {
        chai.request(server)
          .delete('/dialogs/testing.xml')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            done();
          });
      })

      it('DIA_007', function(done) {
        chai.request(server)
          .delete('/dialogs/not_defined.xml')
          .end(function(err, res) {
            expect(res).to.have.status(400);

            done();
          });
      })
    })
  });


  //
  // DialogLine related test cases
  //
  describe('DialogLine', function() {
    describe('Create', function() {
      before(function(done) {
        chai.request(server)
          .get('/dialogs/testing.xml')
          .end(function(err, res) {
            done();
          });
      })
      it('DLI_001', function(done) {
        chai.request(server)
          .post('/dialogs/1')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            done();
          });
      })
    })

    describe('Get', function() {
      before(function(done) {
        chai.request(server)
          .get('/dialogs/testing.xml')
          .end(function(err, res) {
            done();
          });
      })
      it('DLI_002', function(done) {
        chai.request(server)
          .get('/dialog-lines/2')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('2');

            expect(res.body.data).have.property('relationships');
            expect(res.body.data.relationships).to.be.a('object');

            done();
          });
      })
    })

    describe('Get All', function() {
      before(function(done) {
        chai.request(server)
          .get('/dialogs/testing.xml')
          .end(function(err, res) {
            done();
          });
      })
      it('DLI_003', function(done) {
        chai.request(server)
          .get('/dialogs')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            done();
          });
      })
    })

    describe('Change', function() {
      before(function(done) {
        chai.request(server)
          .get('/dialogs/testing.xml')
          .end(function(err, res) {
            done();
          });
      })
      it('DLI_004', function(done) {
        chai.request(server)
          .patch('/dialogs/3')
          .send({"data":{"id":"3","attributes":{"message":"Second line Blub","alreadySaid":false,"width":400,"height":166,"x":10,"y":200},"relationships":{"dialog":{"data":{"type":"dialogs","id":"testing.xml"}}},"type":"dialog-lines"}})
          .end(function(err, res) {
            expect(res).to.have.status(200);

            console.log(res.body);

            done();
          });
      })
    })

    describe('Delete', function() {
      it('DLI_005', function() {

      })
    })
  })


  //
  // Input related test cases
  //
  describe('Input', function() {
    before(function(done) {
      chai.request(server)
        .get('/dialogs/testing.xml')
        .end(function(err, res) {
          done();
        });
    })

    describe('Create', function() {
      it('IPT_001', function(done) {
        chai.request(server)
          .post('/inputs')
          .set('content-type', 'application/vnd.api+json')
          .send({ "data": {
            "id": "test_input",
            "attributes": {
              "x":542,
              "y":140
            },

            "relationships": {
              "connection": {
                "data": {
                  "type": "connections",
                  "id": "63b44f41-5089-428c-afd3-f01c69012d91"
                }
              },

              "belongs-to":{
                "data": {
                  "type":"dialog-lines",
                  "id":"2"
                }
              }
            },

            "type":"inputs"}
          })
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('test_input');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('input');

            done();
          });
      })

      it('IPT_007', function(done) {
        done();
      })


      it('IPT_006', function(done) {
        chai.request(server)
          .post('/inputs')
          .end(function(err, res) {
            expect(res).to.have.status(500);
            done();
          });
      })
    })

    describe('Get', function() {
      it('IPT_002', function(done) {
        chai.request(server)
          .get('/inputs/i1')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('i1');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('input');

            expect(res.body.data).have.property('relationships');
            expect(res.body.data.relationships).to.be.a('object');

            done();
          });
      })
    })

    describe('Get All', function() {
      it('IPT_003', function() {

      })
    })

    describe('Change', function() {
      it('IPT_004', function(done) {
        chai.request(server)
          .patch('/inputs/i1')
          .set('content-type', 'application/vnd.api+json')
          .send({ "data": {
            "id": "i1",
            "attributes": {
              "x": 123,
              "y": 321
            },

            "type":"inputs"}
          })
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('i1');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('inputs');

            expect(res.body.data).have.property('attributes');
            expect(res.body.data.attributes).to.be.a('object');

            expect(res.body.data.attributes).have.property('x');
            expect(res.body.data.attributes.x).to.be.a('number');
            expect(res.body.data.attributes.x).to.be.equal(123);
            expect(res.body.data.attributes).have.property('y');
            expect(res.body.data.attributes.y).to.be.a('number');
            expect(res.body.data.attributes.y).to.be.equal(321);
            done();
          });

      })
    })

    describe('Delete', function() {
      it('IPT_005', function(done) {
        chai.request(server)
          .delete('/inputs/i1')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('i1');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('input');

            done();
          });
      })
    })
  })


  //
  // Output related test cases
  //
  describe('Output', function() {
    before(function(done) {
      chai.request(server)
        .get('/dialogs/testing.xml')
        .end(function(err, res) {
          done();
        });
    })

    describe('Create', function() {
      it('OPT_001', function(done) {
        chai.request(server)
          .post('/outputs')
          .set('content-type', 'application/vnd.api+json')
          .send({ "data": {
            "id": "test_output",
            "attributes": {
              "x":542,
              "y":140
            },

            "relationships": {
              "connection": {
                "data": {
                  "type": "connections",
                  "id": "63b44f41-5089-428c-afd3-f01c69012d91"
                }
              },

              "belongs-to":{
                "data": {
                  "type":"dialog-lines",
                  "id":"2"
                }
              }
            },

            "type":"outputs"}
          })
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('test_output');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('output');

            done();
          });
      })

      it('OPT_007', function(done) {
        done();
      })


      it('OPT_006', function(done) {
        chai.request(server)
          .post('/outputs')
          .end(function(err, res) {
            expect(res).to.have.status(500);
            done();
          });
      })
    })

    describe('Get', function() {
      it('OPT_002', function(done) {
        chai.request(server)
          .get('/outputs/o1')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('o1');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('output');

            expect(res.body.data).have.property('relationships');
            expect(res.body.data.relationships).to.be.a('object');

            done();
          });
      })
    })

    describe('Get All', function() {
      it('OPT_003', function() {

      })
    })

    describe('Change', function() {
      it('OPT_004', function(done) {
        chai.request(server)
          .patch('/outputs/o1')
          .set('content-type', 'application/vnd.api+json')
          .send({ "data": {
            "id": "o1",
            "attributes": {
              "x": 123,
              "y": 321
            },

            "type":"outputs"}
          })
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('o1');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('outputs');

            expect(res.body.data).have.property('attributes');
            expect(res.body.data.attributes).to.be.a('object');

            expect(res.body.data.attributes).have.property('x');
            expect(res.body.data.attributes.x).to.be.a('number');
            expect(res.body.data.attributes.x).to.be.equal(123);
            expect(res.body.data.attributes).have.property('y');
            expect(res.body.data.attributes.y).to.be.a('number');
            expect(res.body.data.attributes.y).to.be.equal(321);
            done();
          });

      })
    })

    describe('Delete', function() {
      it('OPT_005', function(done) {
        chai.request(server)
          .delete('/outputs/o1')
          .end(function(err, res) {
            expect(res).to.have.status(200);

            expect(res.body).to.be.a('object');
            expect(res.body).have.property('data');

            expect(res.body.data).have.property('id');
            expect(res.body.data.id).to.equal('o1');

            expect(res.body.data).have.property('type');
            expect(res.body.data.type).to.equal('output');

            done();
          });
      })
    })
  })

  //
  // Connection related test cases
  //
  describe('Connection', function() {
    describe('Create', function() {
      it('CNT_001', function() {

      })
    })

    describe('Get', function() {
      it('CNT_002', function() {

      })
    })

    describe('Get All', function() {
      it('CNT_003', function() {

      })
    })

    describe('Change', function() {
      it('CNT_004', function() {

      })
    })

    describe('Delete', function() {
      it('CNT_005', function() {

      })
    })
  })

  //
  // Filesystem related test cases
  //
  describe('Filesystem', function() {
    describe('FIS_001', function() {

    })
  })
});