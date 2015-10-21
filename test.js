'use strict';
var assert = require('assert');
var getNepaliNumber = require('./');

it('should convert english number 100 to Nepali correctly', function () {
  assert.strictEqual(getNepaliNumber(100), '१००');
});

it('should convert numbers with decimal correctly', function () {
  assert.strictEqual(getNepaliNumber(200.05), '२००.०५');
});

it('should convert number with comma and decimal point correctly', function () {
  assert.strictEqual(getNepaliNumber('1,000,365.50'), '१,०००,३६५.५०');
});
