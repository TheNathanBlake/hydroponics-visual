var express = require('express');
var  app = express();
var  port = process.env.PORT || 9090;


// Import and register the heartbeat route
var routes = require('./api/routes/heartbeatRoutes');
routes(app);

app.listen(port);

console.log('Heartbeat API listening on port '+ port);

