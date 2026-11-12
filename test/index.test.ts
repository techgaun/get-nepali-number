import { describe, expect, it } from 'vitest';

import getNepaliNumberDefault, {
  fromDevanagariDigits,
  getNepaliNumber,
  toDevanagariDigits,
} from '../src/index';

describe('getNepaliNumber', () => {
  it('exports the same function as default and named export', () => {
    expect(getNepaliNumberDefault).toBe(getNepaliNumber);
  });

  it('should convert english number 100 to Nepali correctly', () => {
    expect(getNepaliNumber(100)).toBe('१००');
  });

  it('should convert numbers with decimal correctly', () => {
    expect(getNepaliNumber(200.05)).toBe('२००.०५');
  });

  it('should format numbers using thousands/lakh/crore separators correctly', () => {
    expect(getNepaliNumber(2000)).toBe('२,०००');
    expect(getNepaliNumber(2000.5)).toBe('२,०००.५');
  });

  it('should format number with comma and decimal point using thousands/lakh/crore separators correctly', () => {
    expect(getNepaliNumber('2,00,000.50')).toBe('२,००,०००.५');
    expect(getNepaliNumber('1,000,365.50')).toBe('१०,००,३६५.५');
  });

  describe('zero', () => {
    it('converts zero', () => {
      expect(getNepaliNumber(0)).toBe('०');
      expect(getNepaliNumber('0')).toBe('०');
      expect(getNepaliNumber('000')).toBe('०');
      expect(getNepaliNumber('0.0')).toBe('०');
    });

    it('drops the sign of negative zero', () => {
      expect(getNepaliNumber(-0)).toBe('०');
      expect(getNepaliNumber('-0')).toBe('०');
      expect(getNepaliNumber('-0.00')).toBe('०');
    });
  });

  describe('negative numbers', () => {
    it('keeps the minus sign for number input', () => {
      expect(getNepaliNumber(-42)).toBe('-४२');
      expect(getNepaliNumber(-2000)).toBe('-२,०००');
      expect(getNepaliNumber(-200.05)).toBe('-२००.०५');
      expect(getNepaliNumber(-1000365.5)).toBe('-१०,००,३६५.५');
    });

    it('keeps the minus sign for string input', () => {
      expect(getNepaliNumber('-42')).toBe('-४२');
      expect(getNepaliNumber('-2,00,000.50')).toBe('-२,००,०००.५');
      expect(getNepaliNumber('-1,000,365.50')).toBe('-१०,००,३६५.५');
    });

    it('accepts an explicit plus sign and drops it', () => {
      expect(getNepaliNumber('+42')).toBe('४२');
      expect(getNepaliNumber('+2,000')).toBe('२,०००');
    });
  });

  describe('large numbers', () => {
    it('groups lakhs and crores', () => {
      expect(getNepaliNumber(100000)).toBe('१,००,०००');
      expect(getNepaliNumber(1000000)).toBe('१०,००,०००');
      expect(getNepaliNumber(10000000)).toBe('१,००,००,०००');
      expect(getNepaliNumber(123456789)).toBe('१२,३४,५६,७८९');
      expect(getNepaliNumber(1234567890123)).toBe('१२,३४,५६,७८,९०,१२३');
    });

    it('handles numbers at and beyond Number.MAX_SAFE_INTEGER', () => {
      expect(getNepaliNumber(Number.MAX_SAFE_INTEGER)).toBe('९,००,७१,९९,२५,४७,४०,९९१');
      expect(getNepaliNumber(1e21)).toBe('१,००,००,००,००,००,००,००,००,००,०००');
      expect(getNepaliNumber(1.5e21)).toBe('१,५०,००,००,००,००,००,००,००,००,०००');
    });

    it('accepts bigint input', () => {
      expect(getNepaliNumber(12345678901234567890n)).toBe('१,२३,४५,६७,८९,०१,२३,४५,६७,८९०');
      expect(getNepaliNumber(-12345678901234567890n)).toBe('-१,२३,४५,६७,८९,०१,२३,४५,६७,८९०');
    });

    it('accepts arbitrarily long numeric strings', () => {
      expect(getNepaliNumber('123456789012345678901234567890')).toBe(
        '१,२३,४५,६७,८९,०१,२३,४५,६७,८९,०१,२३,४५,६७,८९०',
      );
    });
  });

  describe('strings with existing grouping', () => {
    it('regroups western (thousands) grouping into lakh/crore grouping', () => {
      expect(getNepaliNumber('1,000')).toBe('१,०००');
      expect(getNepaliNumber('1,000,000')).toBe('१०,००,०००');
      expect(getNepaliNumber('123,456,789')).toBe('१२,३४,५६,७८९');
    });

    it('keeps already-correct lakh/crore grouping', () => {
      expect(getNepaliNumber('10,00,000')).toBe('१०,००,०००');
      expect(getNepaliNumber('12,34,56,789')).toBe('१२,३४,५६,७८९');
    });

    it('ignores misplaced or stray commas', () => {
      expect(getNepaliNumber('1,0,0,0')).toBe('१,०००');
      expect(getNepaliNumber(',1000,')).toBe('१,०००');
    });

    it('trims surrounding whitespace', () => {
      expect(getNepaliNumber('  2,000  ')).toBe('२,०००');
    });

    it('strips leading zeros from the integer part', () => {
      expect(getNepaliNumber('007')).toBe('७');
      expect(getNepaliNumber('0,007')).toBe('७');
      expect(getNepaliNumber('00.5')).toBe('०.५');
    });

    it('accepts strings that already contain Devanagari digits', () => {
      expect(getNepaliNumber('२०००')).toBe('२,०००');
      expect(getNepaliNumber('१,००,०००.५०')).toBe('१,००,०००.५');
    });
  });

  describe('decimals', () => {
    it('drops trailing zeros in the fraction', () => {
      expect(getNepaliNumber('2000.50')).toBe('२,०००.५');
      expect(getNepaliNumber('100.00')).toBe('१००');
      expect(getNepaliNumber('100.')).toBe('१००');
      expect(getNepaliNumber('0.500')).toBe('०.५');
    });

    it('keeps significant zeros in the fraction', () => {
      expect(getNepaliNumber(0.05)).toBe('०.०५');
      expect(getNepaliNumber('1.0005')).toBe('१.०००५');
    });

    it('does not round long fractions', () => {
      expect(getNepaliNumber('3.14159265')).toBe('३.१४१५९२६५');
      expect(getNepaliNumber(0.1234567)).toBe('०.१२३४५६७');
    });

    it('does not group the fraction part', () => {
      expect(getNepaliNumber('1234567.1234567')).toBe('१२,३४,५६७.१२३४५६७');
    });

    it('accepts fractions without a leading integer', () => {
      expect(getNepaliNumber('.5')).toBe('०.५');
      expect(getNepaliNumber('-.5')).toBe('-०.५');
    });

    it('expands very small numbers that stringify with an exponent', () => {
      expect(getNepaliNumber(1e-7)).toBe('०.००००००१');
      expect(getNepaliNumber(1.5e-7)).toBe('०.००००००१५');
    });
  });

  describe('options', () => {
    it('defaults to grouping', () => {
      expect(getNepaliNumber(1000365)).toBe('१०,००,३६५');
      expect(getNepaliNumber(1000365, {})).toBe('१०,००,३६५');
      expect(getNepaliNumber(1000365, { grouping: true })).toBe('१०,००,३६५');
    });

    it('skips grouping when grouping is false', () => {
      expect(getNepaliNumber(1000365, { grouping: false })).toBe('१०००३६५');
      expect(getNepaliNumber('1,000,365.50', { grouping: false })).toBe('१०००३६५.५');
      expect(getNepaliNumber(-2000, { grouping: false })).toBe('-२०००');
      expect(getNepaliNumber(100, { grouping: false })).toBe('१००');
    });
  });

  describe('invalid input', () => {
    it.each([
      ['NaN', Number.NaN],
      ['Infinity', Number.POSITIVE_INFINITY],
      ['-Infinity', Number.NEGATIVE_INFINITY],
    ])('throws a TypeError for %s', (_label, value) => {
      expect(() => getNepaliNumber(value)).toThrow(TypeError);
      expect(() => getNepaliNumber(value)).toThrow(/finite number/);
    });

    it.each([
      ['an empty string', ''],
      ['a whitespace-only string', '   '],
      ['a lone sign', '-'],
      ['a lone decimal point', '.'],
      ['only commas', ',,,'],
      ['letters', 'abc'],
      ['a number with a unit', '42px'],
      ['two decimal points', '1.2.3'],
      ['exponent notation in a string', '1e5'],
      ['a sign in the middle', '1-2'],
    ])('throws a TypeError for %s', (_label, value) => {
      expect(() => getNepaliNumber(value)).toThrow(TypeError);
      expect(() => getNepaliNumber(value)).toThrow(/numeric value/);
    });

    it.each([
      ['null', null],
      ['undefined', undefined],
      ['an object', { value: 1 }],
      ['an array', [1]],
      ['a boolean', true],
    ])('throws a TypeError for %s', (_label, value) => {
      // @ts-expect-error -- deliberately passing an unsupported type
      expect(() => getNepaliNumber(value)).toThrow(TypeError);
    });
  });
});

describe('toDevanagariDigits', () => {
  it('swaps digits without regrouping', () => {
    expect(toDevanagariDigits('1000365')).toBe('१०००३६५');
    expect(toDevanagariDigits('1,000,365.50')).toBe('१,०००,३६५.५०');
    expect(toDevanagariDigits('-42')).toBe('-४२');
  });

  it('accepts numbers and bigints', () => {
    expect(toDevanagariDigits(2024)).toBe('२०२४');
    expect(toDevanagariDigits(3.14)).toBe('३.१४');
    expect(toDevanagariDigits(123456789012345678901234567890n)).toBe(
      '१२३४५६७८९०१२३४५६७८९०१२३४५६७८९०',
    );
  });

  it('leaves non-digit characters untouched', () => {
    expect(toDevanagariDigits('Room 42, floor 3')).toBe('Room ४२, floor ३');
    expect(toDevanagariDigits('2024-01-15')).toBe('२०२४-०१-१५');
    expect(toDevanagariDigits('')).toBe('');
    expect(toDevanagariDigits('no digits')).toBe('no digits');
  });

  it('maps every digit', () => {
    expect(toDevanagariDigits('0123456789')).toBe('०१२३४५६७८९');
  });
});

describe('fromDevanagariDigits', () => {
  it('swaps Devanagari digits back to Hindu-Arabic digits', () => {
    expect(fromDevanagariDigits('१०,००,३६५.५')).toBe('10,00,365.5');
    expect(fromDevanagariDigits('-४२')).toBe('-42');
    expect(fromDevanagariDigits('०१२३४५६७८९')).toBe('0123456789');
  });

  it('leaves non-digit characters untouched', () => {
    expect(fromDevanagariDigits('कोठा ४२')).toBe('कोठा 42');
    expect(fromDevanagariDigits('')).toBe('');
    expect(fromDevanagariDigits('already 42')).toBe('already 42');
  });

  it('is the inverse of toDevanagariDigits', () => {
    const samples = ['0', '1000365', '-2,000.50', 'Room 42'];
    for (const sample of samples) {
      expect(fromDevanagariDigits(toDevanagariDigits(sample))).toBe(sample);
    }
  });
});
