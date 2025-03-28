import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
    globalIgnores(['cors-skip-server/*']),
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        plugins: {js},
        extends: ['js/recommended'],
    },
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            react,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'prettier/prettier': 'error',
        },
    },
]);
