const common = require('./common.js');
const chai = common.chai;
const server = common.server;
const expect = common.expect;

before(function(done) {
  chai.request(server)
    .get('/dialogs/testing.xml')
    .end(function() {
      done();
    });
})

describe('Create', function() {
  it('IPT_001', function(done) {
    chai.request(server)
      .post('/inputs')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "123",
          type: "inputs",

          relationships: {
            "belongs-to": {
              data: {
                id: '2',
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
        expect(res.body.data.type).to.equal('input');

        done();
      });
  })

  it('IPT_007', function(done) {
    chai.request(server)
      .post('/inputs')
      .set('content-type', 'application/vnd.api+json')
      .send({
        data: {
          id: "123456",
          type: "inputs",
        }
      })
      .end(function(err, res) {
        expect(res).to.have.status(500);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('errorCode');
        expect(res.body.errorCode).to.be.equal('007');

        done();
      });
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
      .send({
        "data": {
          "id": "o1",
          "attributes": {
            "x": 123,
            "y": 321
          },

          "type": "inputs"
        }
      })
      .end(function(err, res) {
        common.checkUpdateOfConnector(res, 'inputs')
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
