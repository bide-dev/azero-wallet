module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  extends: [
    '@metamask/eslint-config',
    'airbnb-base',
    'airbnb-typescript/base',
    // 'plugin:@typescript-eslint/recommended-type-checked',
    // 'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      extends: ['@metamask/eslint-config-nodejs'],
    },
    {
      files: ['**/*.test.ts'],
      extends: ['@metamask/eslint-config-jest'],
      rules: {
        '@typescript-eslint/no-shadow': [
          'error',
          { allow: ['describe', 'expect', 'it'] },
        ],
      },
    },
    {
      files: ['**/*.ts'],
      extends: ['@metamask/eslint-config-typescript'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        'no-restricted-globals': ['error', 'close', 'open', 'event'],
      },
    },
    {
      files: ['**/*.ts'],
      rules: {
        'no-restricted-syntax': 'off',
        'import/prefer-default-export': 'off',
      },
    },
  ],
  ignorePatterns: [
    '!.prettierrc.js',
    '**/!.eslintrc.js',
    '**/dist*/',
    '**/build',
    '**/public',
    '**/.cache',
  ],
};
