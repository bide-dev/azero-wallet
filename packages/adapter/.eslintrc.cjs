module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  ignorePatterns: ['scripts/*.ts'],
  globals: {
    window: 'readonly',
  },
};
