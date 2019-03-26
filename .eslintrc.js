/* eslint-env node */
module.exports = {
    env: {
        browser: true,
        es6: true
    },
    settings: {
        polyfills: [
          "Array.isArray",
          "console",
          "Error"
        ]
    },
    overrides: {
        files: ['docs/jsdoc-config.js'],
        rules: {
          strict: 0,
          'import/unambiguous': 0,
          'import/no-commonjs': 0
        }
    },
    extends: ['ash-nazg/sauron', 'plugin:testcafe/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4]
    }
};
