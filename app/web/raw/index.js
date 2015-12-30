'use strict';

const Boom = require('boom');
const config = require('../../../config');
const parseExt = require('../../utils/parse-ext');

module.exports = function(server, opts, next) {
  let extContentType = opts.extensionContentType || {};

  function rawHandler(req, reply) {
    let registry;
    if (req.params.account) {
      if (config.get('accounts') &&
        config.get('accounts')[req.params.account]) {
        registry = config.get('accounts')[req.params.account].registry;
      } else {
        return reply(Boom.notFound('Passed account not found'));
      }
    } else {
      registry = config.get('registry');
    }

    let metaParts = req.params.pkgMeta.split('@');
    let pkg = {
      name: metaParts[0],
      version: metaParts[1] || 'latest',
      file: req.params.path || '_index.html'
    };

    server.plugins['bundle-service'].getRaw(pkg, {
      registry: registry
    }, function(err, result) {
      if (err) {
        return reply(Boom.notFound(err));
      }
      reply(result.stream)
        .type(extContentType[parseExt(pkg.file).ext])
        .header('cache-control', 'max-age=' + result.maxAge)
        .header('Access-Control-Allow-Origin', '*');
    });
  }

  server.route({
    method: 'GET',
    path: '/raw/{pkgMeta}/{path*}',
    handler: rawHandler
  });

  server.route({
    method: 'GET',
    path: '/{account}/raw/{pkgMeta}/{path*}',
    handler: rawHandler
  });

  next();
};

module.exports.attributes = {
  name: 'web/raw',
  dependencies: ['bundle-service', 'file-max-age']
};
