const config = {
  preset: 'ts-jest', // Ajouter cette ligne
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/node_modules/**',
    '<rootDir>/routes/**/*.{js,jsx,ts,tsx}',
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
