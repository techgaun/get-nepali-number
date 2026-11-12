const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'] as const;

const DEVANAGARI_TO_ASCII: Readonly<Record<string, string>> = Object.fromEntries(
  DEVANAGARI_DIGITS.map((digit, index) => [digit, String(index)]),
);

export interface GetNepaliNumberOptions {
  /**
   * Insert Nepali-style (Lakh/Crore) thousands separators into the integer part.
   * The last three digits form one group and every two digits after that form
   * another, e.g. `1000365` becomes `10,00,365`.
   *
   * @default true
   */
  grouping?: boolean;
}

export type NumberInput = number | string | bigint;

/**
 * Replace every Hindu-Arabic digit (`0`-`9`) with its Devanagari equivalent.
 * Everything else is passed through untouched, so no grouping, trimming or
 * validation happens. Use this when you want full control over the formatting.
 *
 * @example
 * toDevanagariDigits('Room 42') //=> 'Room ४२'
 */
export function toDevanagariDigits(input: string | number | bigint): string {
  return String(input).replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[Number(digit)] as string);
}

/**
 * Replace every Devanagari digit (`०`-`९`) with its Hindu-Arabic equivalent.
 * Everything else is passed through untouched. This is the inverse of
 * {@link toDevanagariDigits}.
 *
 * @example
 * fromDevanagariDigits('२,०००.५') //=> '2,000.5'
 */
export function fromDevanagariDigits(input: string): string {
  return String(input).replace(/[०-९]/g, (digit) => DEVANAGARI_TO_ASCII[digit] as string);
}

/**
 * Convert a Hindu-Arabic numeral to a Nepali (Devanagari) numeral, grouped
 * with Lakh/Crore separators by default.
 *
 * Accepts a `number`, `bigint` or a numeric `string`. Strings may contain
 * thousands separators (`,`) in any position, a leading `+`/`-` sign and
 * Devanagari digits; the input is normalised and regrouped.
 *
 * @throws {TypeError} when the input is not a finite number or a numeric string
 *   (e.g. `NaN`, `Infinity`, `''`, `'abc'`, `null`).
 *
 * @example
 * getNepaliNumber(2000)                        //=> '२,०००'
 * getNepaliNumber('1,000,365.50')              //=> '१०,००,३६५.५'
 * getNepaliNumber(-42)                         //=> '-४२'
 * getNepaliNumber(2000, { grouping: false })   //=> '२०००'
 */
export function getNepaliNumber(input: NumberInput, options: GetNepaliNumberOptions = {}): string {
  const { grouping = true } = options;
  const { negative, integer, fraction } = parseNumber(input);

  const integerPart = grouping ? groupIndian(integer) : integer;
  const sign = negative ? '-' : '';
  const result = fraction ? `${integerPart}.${fraction}` : integerPart;

  return toDevanagariDigits(`${sign}${result}`);
}

export default getNepaliNumber;

interface ParsedNumber {
  negative: boolean;
  /** Integer digits without leading zeros (at least one digit). */
  integer: string;
  /** Fraction digits without trailing zeros (may be empty). */
  fraction: string;
}

const NUMERIC_PATTERN = /^([+-]?)(\d*)(?:\.(\d*))?$/;

function parseNumber(input: NumberInput): ParsedNumber {
  const text = normaliseInput(input);
  const match = NUMERIC_PATTERN.exec(text);

  if (match === null || (match[2] === '' && (match[3] ?? '') === '')) {
    throw new TypeError(`Expected a numeric value, got ${describe(input)}`);
  }

  const integer = (match[2] ?? '').replace(/^0+(?=\d)/, '') || '0';
  const fraction = (match[3] ?? '').replace(/0+$/, '');
  const isZero = integer === '0' && fraction === '';
  const negative = match[1] === '-' && !isZero;

  return { negative, integer, fraction };
}

function normaliseInput(input: NumberInput): string {
  switch (typeof input) {
    case 'number':
      if (!Number.isFinite(input)) {
        throw new TypeError(`Expected a finite number, got ${String(input)}`);
      }
      return expandExponent(String(input));
    case 'bigint':
      return input.toString();
    case 'string':
      return fromDevanagariDigits(input).trim().replace(/,/g, '');
    default:
      throw new TypeError(`Expected a number, bigint or string, got ${describe(input)}`);
  }
}

/**
 * `String(1e21)` yields `'1e+21'` and `String(1e-7)` yields `'1e-7'`; expand
 * such exponent notation into plain decimal digits.
 */
function expandExponent(text: string): string {
  const match = /^(-?)(\d+)(?:\.(\d+))?e([+-]\d+)$/.exec(text);
  if (match === null) {
    return text;
  }

  const [, sign = '', integer = '', fraction = '', exponent = '0'] = match;
  const digits = integer + fraction;
  const pointPosition = integer.length + Number(exponent);

  if (pointPosition <= 0) {
    return `${sign}0.${'0'.repeat(-pointPosition)}${digits}`;
  }
  if (pointPosition >= digits.length) {
    return `${sign}${digits}${'0'.repeat(pointPosition - digits.length)}`;
  }
  return `${sign}${digits.slice(0, pointPosition)}.${digits.slice(pointPosition)}`;
}

/**
 * Group an unsigned integer string using the Indian numbering system:
 * the last three digits, then groups of two (`1000365` -> `10,00,365`).
 */
function groupIndian(integer: string): string {
  if (integer.length <= 3) {
    return integer;
  }

  const head = integer.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const tail = integer.slice(-3);
  return `${head},${tail}`;
}

function describe(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (value === null) {
    return 'null';
  }
  return typeof value === 'object' || typeof value === 'function' ? typeof value : String(value);
}
