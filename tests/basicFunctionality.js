const common = require('./common.js');
const chai = common.chai;
const expect = common.expect;
const parser = common.parser;
const builder = common.builder;

it('Add Invalid Parser', function() {
  const name = 'element';
  chai.expect(() => parser.registerElementParser(name, function() {}, false)).to.throw(`The parser tried to register for the element "${name}" does not contain the methods parse and/or informAboutParsedChildren.`)
})

it('Add Multiple Parser For Same Element', function(done) {
  const name = 'element';
  const parserPath = '../api/libraries/parser/';

  parser.registerElementParser(name, require(parserPath + 'dialogLineParser.js'));
  chai.expect(() => parser.registerElementParser(name, require(parserPath + 'dialogLineParser.js'))).to.throw(`There is already an element parser registered for "${name}" elements.`);

  done();
})

it('Add Multiple Builder For Same Element', function(done) {
  const name = 'dialogLine';
  const parserPath = '../api/libraries/builder/';

  builder.registerElementBuilder(name, require(parserPath + 'dialogLineBuilder.js'));
  chai.expect(() => builder.registerElementBuilder(name, require(parserPath + 'dialogLineBuilder.js'))).to.throw(`There is already an element parser registered for "${name}" elements.`);

  done();
})

it('Parse Invalid File', function(done) {
  parser.parseFile(__dirname + '/../files/empty_file.xml')
  .then(function() {}, function(reason) {
    expect(reason).to.be.a('object');
    expect(reason).have.property('errorCode');
    expect(reason.errorCode).to.equal('004');
    done();
  })
})

it('Get Not Known Parser For Element', function(done) {
  const name = 'unknown_element';
  const request = parser.parseElement(name, {
    '$': {
      id: '1',
      input: 'i1',
      output: 'o1'
    }
  });

  request.catch(function(e) {
    chai.expect(e).to.be.eq(`There is no element parser registered for elements with the tag name "${name}"`);
  });

  done();
})
