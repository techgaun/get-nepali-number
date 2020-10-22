'use strict';
const assert = require('assert');
const getNepaliNumber = require('.');

it('should convert english number 100 to Nepali correctly', () => {
  assert.strictEqual(getNepaliNumber(100), '१००');
});

it('should convert numbers with decimal correctly', () => {
  assert.strictEqual(getNepaliNumber(200.05), '२००.०५');
});

it('should format numbers using thousands/lakh/crore separators correctly', () => {
  assert.strictEqual(getNepaliNumber(2000), '२,०००');
  assert.strictEqual(getNepaliNumber(2000.5), '२,०००.५');
});

it('should format number with comma and decimal point using thousands/lakh/crore separators correctly', () => {
  assert.strictEqual(getNepaliNumber('2,00,000.50'), '२,००,०००.५');
  assert.strictEqual(getNepaliNumber('1,000,365.50'), '१०,००,३६५.५');
});
