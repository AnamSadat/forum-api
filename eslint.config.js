import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';

export default defineConfig([
  {
    plugins: {
      vitest,
    },
  },
  daStyle,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...vitest.environments.env.globals, ...globals.node },
    },
  },
  {
    files: [
      'migrations/**/*.js',
      'src/Applications/use_case/_test/GetThreadUseCase.test.js',
      '**/_test/*.test.js',
    ],
    rules: {
      camelcase: 'off',
    },
  },
]);
