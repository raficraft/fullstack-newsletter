const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

const config = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  modulePaths: ['<rootDir>'],
  moduleNameMapper,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/node_modules/**',
    '<rootDir>/routes/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/controller/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/routes/**/index.{js,jsx,ts,tsx}',
  ],
  clearMocks: true,
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/__mocks__/prisma.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'cobertura'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
      },
    ],
  ],
};

module.exports = config;
