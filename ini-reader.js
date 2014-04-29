'use strict';

/**
 * Reader INI file
 *
 * methods:
 * - load(file)
 * - parse(string)
 */

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

var addValue = function(obj, line) {
  // console.log(obj);
  var lineParts = line.split('=');
  // console.log(lineParts);
  var key = lineParts[0].trim();
  var valObj = obj;
  if (lineParts[0].indexOf('.')) {
    var values = lineParts[0].trim().split('.');
    for (var i = 0; i < values.length-1; i++) {
      obj[values[i]] = {};
      valObj = obj[values[i]];
    }
    key = values[values.length-1];
  }
  var value = lineParts[1].trim();
  if (value === '0' || value === '1') {
    switch (value) {
      case '0':
        value = false;
        break;
      case '1':
        value = true;
    }
  }
  valObj[key] = JSON.parse(value);
};

var extendSection = function(obj, sectionName) {
  // console.log(sectionName);
  var from, to, parts;
  parts = sectionName.split(':');
  to = parts[0].trim();
  from = parts[1].trim();
  var origTo = obj[sectionName];
  origTo = _.extend(_.clone(obj[from]), origTo);
  delete(obj[sectionName]);
  obj[to] = origTo;
};

var parse = function(iniString, done) {
  iniString = iniString.trim();
  // console.log(iniString);
  var eol = '\n';
  if (/\r\n/.test(iniString)) {
    eol = '\r\n';
  }
  var lines = iniString.split(eol);
  var out = {};
  var section = 'global';
  lines.forEach(function(value, index) {
    if (!value || value.match(/^\s*$/) || value.match(/^#/)) return;
    // console.log(section, value);
    if (value.charAt(0) === '[') {
      section = value.replace(/]|\[/g, '').trim();
      out[section] = {};
    } else if (value.indexOf('=') > 0) {
      addValue(out[section], value);
    }
  });
  Object.keys(out).forEach(function(section) {
    if (section.indexOf(':') > 0) {
      extendSection(out, section);
    }
  });
  done(null, out);
};
module.exports.parse = parse;

module.exports.load = function(file, done) {
  if (!fs.existsSync(file)) {
    return done('file does not exists');
  }
  fs.lstat(file, function(err, stats) {
    if (err) {
      return done(err);
    }
    fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
      if (err) {
        return done(err);
      }
      parse(data, done);
    });
  });
};
