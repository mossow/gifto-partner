module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  clearMocks: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};