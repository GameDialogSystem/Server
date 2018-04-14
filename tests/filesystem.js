const common = require('./common.js');
const chai = common.chai;
const expect = common.expect;

it('FIS_001', function(done) {
  this.timeout(15000);

  chai.request('http://localhost:3000')
    .get('/io/null')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('array');

      done();
    });
})

it('FIS_002', function(done) {
  this.timeout(15000);

  chai.request('http://localhost:3000')
    .get('/io/not_existing_path')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(404);

      done();
    });
})
