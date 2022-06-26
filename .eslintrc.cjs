/* eslint-disable quote-props */
module.exports = {
    env: {
        browser: false,
        node: true,
        es2022: true,
    },
    extends: [
        'airbnb-base',
        'plugin:ava/recommended',
    ],
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
    },
    plugins: [
        'ava',
    ],
    rules: {
        // Possible Problems
        'no-control-regex': 'off',
        'no-debugger': 'error',
        'no-prototype-builtins': 'off', // @todo update and auto-fix
        'no-unused-vars': ['warn', {
            args: 'after-used',
            ignoreRestSiblings: true,
        }],

        // Suggestions
        'camelcase': 'off',
        'capitalized-comments': ['error', 'always', {
            'ignoreInlineComments': true,
        }],
        'consistent-return': ['off'],
        'curly': ['error', 'multi-or-nest', 'consistent'],
        'no-console': 'warn',
        'no-else-return': 'off', // @todo update and auto-fix
        'one-var': 'off',
        'one-var-declaration-per-line': ['error', 'initializations'],
        'spaced-comment': ['error', 'always'],

        // Layout & Formatting
        'arrow-parens': ['off'],
        'function-paren-newline': ['error', 'consistent'],
        'indent': ['error', 4], // @todo update and auto-fix
        'key-spacing': 'off',
        'linebreak-style': ['error', 'windows'],
        'max-len': 'off', // @todo update and auto-fix
        'nonblock-statement-body-position': ['error', 'below'],
        'operator-linebreak': 'off', // @todo update and auto-fix

        // Stylistic Issues
        'brace-style': 'off', // @todo update and auto-fix
        'no-bitwise': 'off',
        'no-plusplus': 'off',
        'no-restricted-syntax': 'off',
        'no-underscore-dangle': 'off',
        'quotes': ['error', 'single', {
            allowTemplateLiterals: true,
        }],

        // ECMAScript 6
        'no-confusing-arrow': ['error', {
            allowParens: true,
        }],

        // Import Plugin
        'import/no-unresolved': ['error', {
            /* Ignore resolver errors for unsupported exports-only dependencies.
             * @see https://github.com/import-js/eslint-plugin-import/issues/2352
             */
            ignore: ['ava'],
        }],
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
    },
};
