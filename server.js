var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000,
    server = require('./api/libraries/xmlServer.js'),
    parser = require('./api/libraries/xmlParser.js');

var dialogRoutes = require('./api/routes/dialogRoutes');
var dialogLineRoutes = require('./api/routes/dialogLineRoutes');
var dialogAnswerRoutes = require('./api/routes/dialogAnswerRoutes');
var inputRoutes = require('./api/routes/inputRoutes');
var outputRoutes = require('./api/routes/outputRoutes');

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


dialogRoutes(app);
dialogLineRoutes(app);
dialogAnswerRoutes(app);
inputRoutes(app);
outputRoutes(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  next();
});



app.listen(port);

//server.readAllDialogs();

app.get('/',function(req,res){
    parser.registerElementParser('dialog', require('./api/libraries/dialogParser.js'));
    parser.registerElementParser('dialog_line', require('./api/libraries/dialogLineParser.js'));
    parser.registerElementParser('text', require('./api/libraries/textParser.js'));
    parser.registerElementParser('condition', require('./api/libraries/conditionParser.js'));

    parser.parseFile('./files/foo.xml', res);
});

console.log('UE Dialog RESTful API server started on: ' + port);
