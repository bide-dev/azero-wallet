module.exports = {
  extends: ['../../.eslintrc.js'],

  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        'jsdoc/require-jsdoc': 0,
        'no-restricted-globals': 0,
      },
    },
  ],

  ignorePatterns: ['!.eslintrc.js', 'build/'],
};
