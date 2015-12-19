'use strict';

const cssUrlRewrite = require('css-url-rewrite');
const urlResolver = require('url').resolve;
const R = require('ramda');

function fullCssUrl(params) {
  let filePath = (params.pkg.filePath[0] === '/' ? '' : '/') +
    params.pkg.filePath;
  let basePath = '/raw/' + params.pkg.name + '@' + params.pkg.version + filePath;

  function replace(url) {
    if (url.match(/^https?:/)) {
      return url;
    }
    return urlResolver(basePath, url);
  }

  let replaced = cssUrlRewrite(params.content, replace);
  return R.merge(params, {
    content: replaced
  });
}

module.exports = fullCssUrl;
