const chai = require('chai'),
  fs = require("fs"),
  chaiHttp = require('chai-http'),
  chaiFs = require('chai-fs'),
  chaiFiles = require('chai-files'),
  parser = require('../api/libraries/parser/xmlParser.js'),
  builder = require('../api/libraries/builder/xmlBuilder.js'),
  xmlServer = require('../api/libraries/xmlServer.js'),
  emberParser = require('../api/libraries/parser/emberDataParser.js'),
  server = require('../server'),
  expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiFs);
chai.use(chaiFiles);

exports.chai = chai;
exports.file = chaiFiles.file;
exports.dir = chaiFiles.dir;
exports.expect = chai.expect;
exports.parser = parser;
exports.builder = builder;
exports.xmlServer = xmlServer;
exports.emberParser = emberParser;
exports.server = server;
exports.fs = fs;

exports.serverRequest = function(route, content) {
  return chai.request(server)[route](content)
    .set('content-type', 'application/vnd.api+json');
}


exports.createConnectorTestData = function() {
  return {
    "data": {
      "id": "3",
      "attributes": {
        "message": "Second line Blub",
      },
      "relationships": {
        "dialog": {
          "data": {
            "type": "dialogs",
          }
        }
      },
      "type": "dialog-lines"
    }
  }
}

exports.checkUpdateOfConnector = function(res, connectorType) {
  expect(res).to.have.status(200);

  expect(res.body).to.be.a('object');
  expect(res.body).have.property('data');

  expect(res.body.data).have.property('id');
  expect(res.body.data.id).to.equal('o1');

  expect(res.body.data).have.property('type');
  expect(res.body.data.type).to.equal(connectorType);

  expect(res.body.data).have.property('attributes');
  expect(res.body.data.attributes).to.be.a('object');

  expect(res.body.data.attributes).have.property('x');
  expect(res.body.data.attributes.x).to.be.a('number');
  expect(res.body.data.attributes.x).to.be.equal(123);
  expect(res.body.data.attributes).have.property('y');
  expect(res.body.data.attributes.y).to.be.a('number');
  expect(res.body.data.attributes.y).to.be.equal(321);
}
