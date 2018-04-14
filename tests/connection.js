const common = require('./common.js');
const chai = common.chai;
const server = common.server;
const expect = common.expect;

describe('Create', function() {
  it('CNT_001', function(done) {
    common.serverRequest('post', '/connections')
      .send({
        data:
      {
        id: 1,

        relationships : {
          output: {
            data: {
              id: 'o1',
              type: 'output'
            }
          }
        }
      }})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        done();
      })
  })
})

describe('Get', function() {
  it('CNT_002', function() {
    common.serverRequest('get', '/connections/1')
    .end(function(err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
    })
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
  it('CNT_005', function(done) {
    common.serverRequest('delete', '/connections/1')
      .send({
        data:
      {
        id: 1,
        type: 'connection'
      }})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        done();
      })
  })

  it('CNT_006', function(done) {
    chai.request(server)
      .delete('/connections/not_existing_connection')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(400);

        done();
      })
  })
})
