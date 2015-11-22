'use strict';

var config = require('./config');
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: config.port });

server.register([
  {
    register: require('./app/plugins/reference-service'),
    options: {
      storagePath: config.storagePath
    }
  },
  {
    register: require('./app/plugins/bundle-service'),
    options: {
      storagePath: config.storagePath,
      resourcesHost: config.ip + ':' + config.port
    }
  },
  { register: require('./app/web/bundle') },
  {
    register: require('./app/web/publish'),
    options: {
      storagePath: config.storagePath,
      tempPath: config.tempPath
    }
  },
  { register: require('./app/web/push') },
], function(err) {
  if (err) {
    throw err;
  }

  server.start(function() {
    console.log('--------------------------------------');
    console.log('');
    console.log('  Ung server started');
    console.log('  Hosted on ' + server.info.uri);
    console.log('  Press Ctrl+C to stop the server');
    console.log('');
    console.log('--------------------------------------');
  });
});
