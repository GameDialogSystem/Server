var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000,
    server = require('./api/libraries/xmlServer.js');

var dialogRoutes = require('./api/routes/dialogRoutes');
var dialogLineRoutes = require('./api/routes/dialogLineRoutes');
var dialogAnswerRoutes = require('./api/routes/dialogAnswerRoutes');
var inputRoutes = require('./api/routes/inputRoutes');
var outputRoutes = require('./api/routes/outputRoutes');
var connectionRoutes = require('./api/routes/connectionRoutes');

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// register the routes
dialogRoutes(app);
dialogLineRoutes(app);
dialogAnswerRoutes(app);
inputRoutes(app);
outputRoutes(app);
connectionRoutes(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  next();
});

// registers element parsers and initializes the xml server
server.initialize();
server.readAllDialogs();

server.getDialog(1).then(result => {
  //server.saveDialog(1);
})

app.listen(port);

console.log('UE Dialog RESTful API server started on: ' + port);
