var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000,
    builder = require('./api/libraries/builder/xmlBuilder.js'),
    parser = require('./api/libraries/parser/xmlParser.js'),
    dialogRoutes = require('./api/routes/dialogRoutes'),
    dialogLineRoutes = require('./api/routes/dialogLineRoutes'),
    inputRoutes = require('./api/routes/inputRoutes'),
    outputRoutes = require('./api/routes/outputRoutes'),
    connectionRoutes = require('./api/routes/connectionRoutes'),
    filesystemRoutes = require('./api/routes/filesystemRoutes');

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  next();
});

// register the routes
dialogRoutes(app);
dialogLineRoutes(app);
inputRoutes(app);
outputRoutes(app);
connectionRoutes(app);
filesystemRoutes(app);


const builderPath = './api/libraries/builder/';
const parserPath = './api/libraries/parser/';


parser.registerElementParser('dialog', require(parserPath + 'dialogParser.js'), false);
parser.registerElementParser('meta', require(parserPath + 'metaParser.js'), false);
parser.registerElementParser('dialog_line', require(parserPath + 'dialogLineParser.js'), true);
parser.registerElementParser('connection', require(parserPath + 'connectionParser.js'), false);
parser.registerElementParser('input', require(parserPath + 'inputParser.js'), false);
parser.registerElementParser('output', require(parserPath + 'outputParser.js'), false);


builder.registerElementBuilder('dialog', require(builderPath + 'dialogBuilder.js'));
//builder.registerElementBuilder('dialog_line', require(builderPath + 'dialogLineBuilder.js'));
//builder.registerElementBuilder('connection', require(builderPath + 'connectionBuilder.js'));
//builder.registerElementBuilder('output', require(builderPath + 'outputBuilder.js'));



const server = app.listen(port, function() {
  console.log('UE Dialog RESTful API server started on: ' + port);
});

module.exports = server;
