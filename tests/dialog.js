const common = require('./common.js');
const chai = common.chai;
const expect = common.expect;
const fs = common.fs;
const file = common.file;
const xmlServer = common.xmlServer;
const parser = common.parser;

const testFile = './files/newly_saved_dialog.xml';

describe('Create', function() {
  it('DIA_001', function(done) {
    done();
  })


  it('DIA_010', function(done) {
    chai.request('http://localhost:3000')
      .get('/dialogs/testing.xml')
      .end(function(err, res) {
        expect(file(testFile)).to.not.exist;
        xmlServer.saveFile(res.body, testFile).then(() => {

          expect(file(testFile)).to.exist;
          done();
        });
      });
  })

  after(function(done) {
    const path = common.xmlServer.directory + '/newly_saved_dialog.xml';
      fs.unlink(path, () => {
        done();
      });
  })
})

describe('Get', function() {
  it('DIA_002', function(done) {

    chai.request('http://localhost:3000')
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
        expect(res.body.data.relationships.lines.data.length).to.be.equal(3);

        expect(res.body.data.relationships).to.have.property('starting-line');

        // check outputs
        let outputs = parser.getAllParsedElementsOfATag('output');
        //expect(outputs).to.be.a('object');
        outputs.forEach(function(output) {
          expect(output).to.be.a('object');
          expect(output).to.have.property('data');
          expect(output.data).to.have.property('id');
          expect(output.data).to.have.property('type');
          expect(output.data).to.have.property('relationships')
        });
        done();
      });
  })

  it('DIA_006', function(done) {
    chai.request('http://localhost:3000')
      .get('/dialogs/testing_blub.xml')
      .end(function(err, res) {
        expect(res).to.have.status(500);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('errorCode');
        expect(res.body.errorCode).to.equal('004');

        done();
      });
  })



  it('DIA_008', function(done) {
    chai.request('http://localhost:3000')
      .get('/dialogs/invalid_file.xml')
      .end(function(err, res) {
        expect(res).to.have.status(500);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('errorCode');
        expect(res.body.errorCode).to.equal('006');

        done();
      });
  })

  it('DIA_009', function(done) {
    chai.request('http://localhost:3000')
      .get('/dialogs/not_existing_file.xml')
      .end(function(err, res) {
        expect(res).to.have.status(500);

        expect(res.body).to.be.a('object');
        expect(res.body).have.property('errorCode');
        expect(res.body.errorCode).to.equal('003');

        done();
      });
  })
})

describe('Get All', function() {
  it('DIA_003', function(done) {
    done();
  })
})

describe('Change', function() {
  it('DIA_004', function(done) {
    done()
  })
})

describe('Delete', function() {
  before(function(done) {
    chai.request('http://localhost:3000')
      .get('/dialogs/testing.xml')
      .end(function() {
        done();
      });
  })
  it('DIA_005', function(done) {
    chai.request('http://localhost:3000')
      .delete('/dialogs/testing.xml')
      .end(function(err, res) {
        expect(res).to.have.status(200);

        done();
      });
  })

  it('DIA_007', function(done) {
    chai.request('http://localhost:3000')
      .delete('/dialogs/not_defined.xml')
      .end(function(err, res) {
        expect(res).to.have.status(400);

        done();
      });
  })
})
