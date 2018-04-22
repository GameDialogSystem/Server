const common = require('./common.js'),
  chai = common.chai,
  server = common.server,
  expect = common.expect,
  fs = common.fs;

const tempFileName = 'test' + Date.now() + '.xml';
const path = __dirname + "/../files/tmp/";

before(function(done) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  fs.writeFile(path + tempFileName,
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <dialog id="testing.xml" name="Bunny Dialog" starting-line="2">
    <dialog_line id="2" x="10" y="10" outputs="o1">
      <text>S 0_0</text>
    </dialog_line>

    <dialog_line id="3" x="10" y="200" inputs="i1" outputs="o2">
      <text>Second line</text>
    </dialog_line>

    <dialog_line id="4" x="10" y="400" inputs="i2">
      <text>Third line</text>
    </dialog_line>

    <connection id="1" input="i1" output="o1" />
    <connection id="2" input="i2" output="o2" />
  </dialog>`,
    function(err) {
      if (err) {
        return console.log(err);
      }

      chai.request(server)
        .get('/dialogs/' + encodeURIComponent('tmp/') + tempFileName)
        .end(function() {
          console.log("BLAAAA");
          done();
        });
    });
});

after(function(done) {
  fs.unlinkSync(path + tempFileName);
  fs.rmdirSync(path);

  done();
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
        /*
                expect(res.body).to.be.a('object');
                expect(res.body).have.property('data');

                expect(res.body.data).have.property('id');
                expect(res.body.data.id).to.equal('i1');

                expect(res.body.data).have.property('type');
                expect(res.body.data.type).to.equal('input');

                expect(res.body.data).have.property('relationships');
                expect(res.body.data.relationships).to.be.a('object');
        */
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
