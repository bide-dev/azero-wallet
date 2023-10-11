module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  globals: {
    window: 'readonly',
  },
};
