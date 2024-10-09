import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-debugger': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'max-classes-per-file': 'off',
      'no-underscore-dangle': 'off',
      'no-shadow': 'off',
      'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
      'eol-last': ['error', 'always'],
    },
  },
];
