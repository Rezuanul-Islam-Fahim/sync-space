import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        ignores: ['logs/**', 'node_modules/**'],
    },
    js.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2024,
            },
        },
        rules: {
            'no-console': 'error',
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
];
