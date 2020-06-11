'use strict';
var assert = require('assert');
var getNepaliNumber = require('./');

it('should convert english number 100 to Nepali correctly', function () {
  assert.strictEqual(getNepaliNumber(100), '१००');
});

it('should convert numbers with decimal correctly', function () {
  assert.strictEqual(getNepaliNumber(200.05), '२००.०५');
});

it('should format numbers using thousands/lakh/crore separators correctly', function () {
  assert.strictEqual(getNepaliNumber(2000), '२,०००');
  assert.strictEqual(getNepaliNumber(2000.50), '२,०००.५');
});

it('should format number with comma and decimal point using thousands/lakh/crore separators correctly', function () {
  assert.strictEqual(getNepaliNumber('2,00,000.50'), '२,००,०००.५');
  assert.strictEqual(getNepaliNumber('1,000,365.50'), '१०,००,३६५.५');
});
