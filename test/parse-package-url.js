'use strict';

var expect = require('chai').expect;
var parseURL = require('../utils/parse-package-url');

describe('parse package url', function() {
  it('should parse one package with version', function() {
    var packages = parseURL('foo@4.2.1');
    expect(packages.length).to.eq(1);
    expect(packages[0].name).to.eq('foo');
    expect(packages[0].version).to.eq('4.2.1');
    expect(packages[0].files.length).to.eq(1);
    expect(packages[0].files[0]).to.eq('index.js');
  });

  it('should parse one package with no version', function() {
    var packages = parseURL('foo');
    expect(packages.length).to.eq(1);
    expect(packages[0].name).to.eq('foo');
    expect(packages[0].version).to.eq('*');
    expect(packages[0].files.length).to.eq(1);
    expect(packages[0].files[0]).to.eq('index.js');
  });

  it('should parse two packages', function() {
    var packages = parseURL('foo@3,bar@1.2');
    expect(packages.length).to.eq(2);
    expect(packages[0].name).to.eq('foo');
    expect(packages[0].version).to.eq('3');
    expect(packages[1].name).to.eq('bar');
    expect(packages[1].version).to.eq('1.2');
    expect(packages[0].files.length).to.eq(1);
    expect(packages[0].files[0]).to.eq('index.js');
    expect(packages[1].files.length).to.eq(1);
    expect(packages[1].files[0]).to.eq('index.js');
  });

  it('should parse package with version and files', function() {
    var packages = parseURL('foo@3|bar.js;lib/index.js');
    expect(packages.length).to.eq(1);
    expect(packages[0].name).to.eq('foo');
    expect(packages[0].version).to.eq('3');
    expect(packages[0].files.length).to.eq(2);
    expect(packages[0].files[0]).to.eq('bar.js');
    expect(packages[0].files[1]).to.eq('lib/index.js');
  });
});
