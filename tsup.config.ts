import { defineConfig } from 'tsup';

/**
 * Appended to the CommonJS bundle so that `require('get-nepali-number')`
 * keeps returning the function directly (as 0.2.x did) while still exposing
 * the named exports and `default` as properties on it. tsup's built-in
 * `cjsInterop` only kicks in when `default` is the sole export, which is not
 * the case here.
 */
const cjsFooter = [
  'module.exports = Object.assign(module.exports.default, module.exports);',
  "Object.defineProperty(module.exports, '__esModule', { value: true });",
].join('\n');

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2020',
  platform: 'neutral',
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildOptions(options, { format }) {
    if (format === 'cjs') {
      options.footer = { js: cjsFooter };
    }
  },
});
