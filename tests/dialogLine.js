const common = require('./common.js');
const chai = common.chai;
const server = common.server;
const expect = common.expect;
const fs = common.fs;
const file = common.file;
const xmlServer = common.xmlServer;
const parser = common.parser;

before(function(done) {
  chai.request(server)
    .get('/dialogs/testing.xml')
    .end(function() {
      done();
    });
})

describe('Create', function() {
  it('DLI_001', function(done) {
    chai.request(server)
      .post('/dialog-lines')
      .set('content-type', 'application/vnd.api+json')
      .end(function(err, res) {
        expect(res).to.have.status(400);

        done();
      });
  })

  it('DLI_007', function(done) {
    chai.request(server)
      .post('/dialog-lines')
      .set('content-type', 'application/vnd.api+json')
      .send({})
      .end(function(err, res) {
        expect(res).to.have.status(400);

        done();
      });
  })

  it('DLI_008', function(done) {
    chai.request(server)
      .post('/dialog-lines')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "newly_created_dialog_line",
          attributes: {
            message: "Random Text 91",
            alreadySaid: false,
            x: 420,
            y: 200
          },

          relationships: {
            dialog: {
              data: {
                type: "dialogs",
                id: "testing.xml"
              }
            }
          },

          type: "dialog-lines"
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);

        done();
      });
  })

  it('DLI_009', function(done) {
    chai.request(server)
      .post('/dialog-lines')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "newly_created_dialog_line",
          type: "dialog-lines"
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(400);

        done();
      });
  })

  it('DLI_012', function(done) {
    chai.request(server)
      .post('/dialog-lines')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "newly_created_dialog_line",
          type: "dialog-lines",

          relationships: {
            dialog: {
              data: {
                type: "dialogs",
              }
            }
          },
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(400);

        done();
      });
  })
})

describe('Get', function() {
  it('DLI_002', function(done) {
    chai.request(server)
      .get('/dialog-lines/3')
      .end(function(err, res) {
        expect(res).to.have.status(200);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('data');

        expect(res.body.data).have.property('id');
        expect(res.body.data.id).to.equal('3');

        expect(res.body.data).have.property('relationships');
        expect(res.body.data.relationships).to.be.a('object');

        done();
      });
  })
})

describe('Get All', function() {
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

  it('DLI_004', function(done) {
    common.serverRequest('patch', '/dialog-lines/3')
      .send({
        "data": {
          "id": "3",
          "attributes": {
            "message": "Second line Blub",
            "alreadySaid": false,
            "width": 400,
            "height": 166,
            "x": 10,
            "y": 200
          },
          "relationships": {
            "dialog": {
              "data": {
                "type": "dialogs",
                "id": "testing.xml"
              }
            }
          },
          "type": "dialog-lines"
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);

        done();
      });
  })

  it('DLI_010', function(done) {
    var result = common.createConnectorTestData();
    result.data.relationships.dialog.data.id = "invalid_dialog_relationships"

    common.serverRequest('patch', '/dialog-lines/3')
      .send(result)
      .end(function(err, res) {
        expect(res).to.have.status(400);

        done();
      });
  })

  it('DLI_011', function(done) {
    common.serverRequest('patch', '/dialog-lines/3')
      .send(common.createConnectorTestData())
      .end(function(err, res) {
        expect(err).to.be.null;

        //expect(res).to.have.status(400);

        done();
      });
  })
})

describe('Delete', function() {
  it('DLI_005', function(done) {
    chai.request(server)
      .delete('/dialog-lines/3')
      .send({
        'id': 3,
        'type': 'dialog-line'
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);

        done();
      });
  });

  it('DLI_006', function(done) {
    chai.request(server)
      .delete('/dialog-lines/not-existing-dialog-line')
      .send({
        'id': 3,
        'type': 'dialog-line'
      })
      .end(function(err, res) {
        expect(res).to.have.status(400);

        done();
      });
  });

})
