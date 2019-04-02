'use strict';
module.exports = function(app) {
  var heartbeat = require('../controllers/heartbeatController');

  app.route('/status').get(heartbeat.getSystemSpecs);
};
