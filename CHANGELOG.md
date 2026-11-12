# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-11-11

### Added

- TypeScript source with bundled type declarations.
- ESM build (`dist/index.mjs`) alongside the CommonJS build (`dist/index.js`),
  wired up through a conditional `exports` map. `import getNepaliNumber from 'get-nepali-number'`
  and `const getNepaliNumber = require('get-nepali-number')` both return the function directly.
- Named export `getNepaliNumber` (same function as the default export).
- `toDevanagariDigits(input)` helper that only swaps `0`-`9` for `०`-`९` without any grouping,
  trimming or validation.
- `fromDevanagariDigits(input)` helper that swaps `०`-`९` back to `0`-`9`.
- Optional second argument `{ grouping?: boolean }` (default `true`) to disable Lakh/Crore grouping.
- `bigint` input support and support for arbitrarily long numeric strings.
- Strings containing Devanagari digits are accepted as input.

### Fixed

- Negative numbers no longer lose their sign (`getNepaliNumber(-42)` returned `'४२'`, now `'-४२'`).
- Numbers that stringify in exponent notation (e.g. `1e21`, `1e-7`) are expanded to plain digits
  (`getNepaliNumber(1e-7)` returned `'०'`, now `'०.००००००१'`).

### Changed

- Lakh/Crore grouping is now done by a small hand-written grouper instead of
  `Intl.NumberFormat('en-IN')`, so the output no longer depends on the ICU data available
  in the runtime and is identical in browsers and Node.
- Fractions are no longer rounded to three digits (a side effect of the old `Intl` formatting):
  `getNepaliNumber('3.14159')` now returns `'३.१४१५९'` instead of `'३.१४२'`. Trailing zeros in the
  fraction are still dropped, so `'2000.50'` still becomes `'२,०००.५'`.
- Invalid input now throws a `TypeError` with a descriptive message. This covers `NaN`,
  `Infinity`, empty or whitespace-only strings, non-numeric strings such as `'abc'` or `'1e5'`,
  and non-number/string/bigint values such as `null` or `undefined`. Previously these silently
  returned `''` or `'०'` (or threw an unrelated error for `null`/`undefined`).
- Minimum supported Node.js version is now 22 (`engines.node >= 22`). CI runs on Node 22, 24
  and 26, and `.nvmrc` pins development to Node 26. Nothing in the published code depends on the
  Node version; this only reflects the maintenance policy and the tooling (tsup 9, vitest 5,
  eslint 10, TypeScript 6).
- The published package contains `dist/` instead of a root `index.js`.

### Removed

- `full-icu` dev dependency (modern Node ships full ICU and the library no longer needs it).
- Travis CI configuration, replaced by GitHub Actions running on Node 22, 24 and 26.
- `xo` and `mocha`, replaced by `typescript-eslint` + `prettier` and `vitest`.

## [0.2.0] and earlier

See the [commit history](https://github.com/techgaun/get-nepali-number/commits/master).

[0.3.0]: https://github.com/techgaun/get-nepali-number/releases/tag/v0.3.0
