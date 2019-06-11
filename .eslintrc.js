/* eslint-env node */
'use strict';

module.exports = {
    env: {
        browser: true,
        es6: true
    },
    settings: {
        polyfills: [
            'Array.isArray',
            'console',
            'Error',
            'Number.isNaN',
            'Number.parseFloat',
            'Number.parseInt'
        ]
    },
    overrides: [{
        files: ['docs/jsdoc-config.js', '.eslintrc.js'],
        extends: [
            'plugin:node/recommended-script'
        ],
        rules: {
            strict: 0,
            'import/unambiguous': 0,
            'import/no-commonjs': 0
        }
    }],
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
