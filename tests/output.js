const common = require('./common.js');
const chai = common.chai;
const server = common.server;
const expect = common.expect;


before(function(done) {
  chai.request('http://localhost:3000')
    .get('/dialogs/testing.xml')
    .end(function() {
      done();
    });
})

describe('Create', function() {

  it('OPT_001', function(done) {
    chai.request(server)
      .post('/outputs')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "123",
          type: "outputs",

          relationships: {
            "belongs-to": {
              data: {
                id: '4',
                type: "dialog-line",
              }
            }
          }
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('data');

        expect(res.body.data).have.property('id');
        expect(res.body.data.id).to.equal('123');

        expect(res.body.data).have.property('type');
        expect(res.body.data.type).to.equal('output');

        done();
      });
  })

  it('OPT_009', function(done) {
    chai.request(server)
      .post('/outputs')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "123blub",
          type: "outputs",

          relationships: {
            "belongs-to": {
              data: {
                id: '4',
                type: "dialog-line",
              }
            }
          }
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(200);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('data');

        expect(res.body.data).have.property('id');
        expect(res.body.data.id).to.equal('123blub');

        expect(res.body.data).have.property('type');
        expect(res.body.data.type).to.equal('output');

        done();
      });
  })

  it('OPT_007', function(done) {
    chai.request(server)
      .post('/outputs')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "123456",
          type: "outputs",
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(500);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('errorCode');
        expect(res.body.errorCode).to.be.equal('001');

        done();
      });
  })


  it('OPT_006', function(done) {
    chai.request(server)
      .post('/outputs')
      .set('content-type', 'application/vnd.api+json')
      .send({})
      .end(function(err, res) {
        expect(res).to.have.status(500);
        done();
      });
  })

  it('OPT_008', function(done) {
      chai.request(server)
      .post('/outputs')
      .set('content-type', 'application/vnd.api+json')
      .send({"data":{"id":"o0__6396","attributes":{"x":782,"y":340},"relationships":{"connection":{"data":{"type":"connections","id":"5a6a1140-3c55-456a-8a62-80818a3820dd"}},"belongs-to":{"data":{"type":"dialog-lines","id":"2f99b569-82bb-448b-a69f-8c8e21c7d660"}}},"type":"output"}})
      .end(function(err, res) {
        expect(err).to.be.null;

        expect(res).to.have.status(500);
        expect(res.body).have.property('errorCode');
        expect(res.body.errorCode).to.be.equal('009');
        done();
      })
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
      .send({
        "data": {
          "id": "o1",
          "attributes": {
            "x": 123,
            "y": 321
          },

          "type": "outputs"
        }
      })
      .end(function(err, res) {
        common.checkUpdateOfConnector(res, 'outputs')
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
