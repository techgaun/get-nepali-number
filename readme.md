# get-nepali-number

[![CI](https://github.com/techgaun/get-nepali-number/actions/workflows/ci.yml/badge.svg)](https://github.com/techgaun/get-nepali-number/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/get-nepali-number.svg)](https://www.npmjs.com/package/get-nepali-number)

> Convert any english (technically Hindu-Arabic) numeral to a Nepali (Devanagari) numeral, grouped the Nepali way (Lakh/Crore).

- Zero dependencies, no `Intl`/ICU needed, works in Node (>= 22) and every browser.
- Ships ESM, CommonJS and TypeScript declarations.
- Keeps the sign of negative numbers, handles `bigint` and arbitrarily long numeric strings.

## Install

```sh
npm install get-nepali-number
# or
yarn add get-nepali-number
# or
pnpm add get-nepali-number
```

## Usage

```js
// ESM / TypeScript
import getNepaliNumber from 'get-nepali-number';

// CommonJS
const getNepaliNumber = require('get-nepali-number');

getNepaliNumber(100);
//=> '१००'

getNepaliNumber(2000);
//=> '२,०००'

getNepaliNumber(200.05);
//=> '२००.०५'

getNepaliNumber(2000.5);
//=> '२,०००.५'

getNepaliNumber('2,00,000.50');
//=> '२,००,०००.५'

getNepaliNumber('1,000,365.50');
//=> '१०,००,३६५.५'

getNepaliNumber(-42);
//=> '-४२'

getNepaliNumber(12345678901234567890n);
//=> '१,२३,४५,६७,८९,०१,२३,४५,६७,८९०'

getNepaliNumber(1000365, { grouping: false });
//=> '१०००३६५'
```

The named exports are available too:

```js
import { getNepaliNumber, toDevanagariDigits, fromDevanagariDigits } from 'get-nepali-number';

toDevanagariDigits('Room 42, floor 3');
//=> 'Room ४२, floor ३'

fromDevanagariDigits('१०,००,३६५.५');
//=> '10,00,365.5'
```

## API

### getNepaliNumber(input, options?)

Returns a `string` with Devanagari digits.

#### input

Type: `number | string | bigint`

The value to convert. Strings may contain thousands separators (`,`) in any
position (they are removed and the number is regrouped), surrounding whitespace,
a leading `+`/`-` sign and even Devanagari digits. Leading zeros in the integer
part and trailing zeros in the fraction are dropped (`'007.50'` → `'७.५'`).

Throws a `TypeError` for anything that is not a finite number or a numeric
string: `NaN`, `Infinity`, `''`, `'abc'`, `'1e5'`, `null`, `undefined`,
objects, etc.

#### options

Type: `object`

##### grouping

Type: `boolean`\
Default: `true`

Insert Lakh/Crore separators into the integer part (the last three digits form
one group, every two digits after that form another: `1000365` → `10,00,365`).
Set to `false` to only swap the digits.

### toDevanagariDigits(input)

Type: `(input: string | number | bigint) => string`

Replaces every `0`-`9` with the matching Devanagari digit and leaves everything
else untouched. No grouping, trimming or validation is done, so use it when you
want to format the number yourself.

### fromDevanagariDigits(input)

Type: `(input: string) => string`

The inverse of `toDevanagariDigits`: replaces every `०`-`९` with the matching
Hindu-Arabic digit and leaves everything else untouched.

## TypeScript

Types are bundled. The `GetNepaliNumberOptions` and `NumberInput` types are
exported for convenience:

```ts
import getNepaliNumber, { type GetNepaliNumberOptions } from 'get-nepali-number';

const options: GetNepaliNumberOptions = { grouping: false };
const price: string = getNepaliNumber(1999.99, options);
```

## Supported Node.js versions

The package requires Node.js 22 or newer (`engines.node >= 22`) and is tested on
Node 22, 24 and 26 in CI. The published code is plain ES2020 with no runtime
dependencies, so it also runs in any evergreen browser. An `.nvmrc` pins the
development version to 26.

## Development

```sh
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # eslint + prettier --check
npm test            # vitest
npm run build       # tsup -> dist/ (esm, cjs, d.ts)
```

## License

MIT © [techgaun](https://techgaun.com)
