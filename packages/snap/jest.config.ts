import crypto from 'node:crypto';

export default {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'test'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'json', 'ts', 'mjs', 'cjs'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  setupFilesAfterEnv: ['jest-extended/all'],
  globals: {
    window: {
      crypto,
    },
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            dynamicImport: true,
          },
          baseUrl: './',
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testTimeout: 120000,
};
