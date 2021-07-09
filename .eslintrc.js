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
            'document.createElementNS',
            'Error',
            'Number.isNaN',
            'Number.parseFloat',
            'Number.parseInt'
        ]
    },
    extends: ['ash-nazg/sauron-overrides', 'plugin:testcafe/recommended'],
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        indent: ['error', 4],
        'eslint-comments/require-description': 0
    }
};
