'use strict';

var ini = require('../ini-reader'),
    test = require('tap').test,
    fs = require('fs'),
    path = require('path'),
    fixture = path.resolve(__dirname + './fixtures/application.ini'),
    expected = {
      default: {
        migration: { dir: './../migrate' },
        debug: false,
        log: { dir: './../tmp' },
        database: { config: './database.ini' }
      },
      development: {
        migration: { dir: './../migrate' },
        debug: true,
        log: { dir: './../tmp' },
        database: { config: './database.ini' }
      },
      test: {
        migration: { dir: './../migrate' },
        debug: true,
        log: { dir: './../tmp' },
        database: { config: './database.ini' }
      },
      mhervo: {
        migration: { dir: './../migrate' },
        debug: true,
        log: { dir: '/path/logs/mhervo/ini-reader' },
        database: { config: './database.ini' }
      }
    };

test("load file", function (t) {
  ini.load(fixture, function(err, d) {
    t.deepEqual(d, expected);
    t.end();
  });
});

test("parse data", function (t) {
  var data = fs.readFileSync(fixture, {encoding: 'utf8'});
  ini.parse(data, function(err, e) {
    t.deepEqual(e, expected);
    t.end();
  });
});