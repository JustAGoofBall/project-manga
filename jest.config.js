module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'index.js',
    'db.js',
    '!node_modules/**',
    '!tests/**'
  ],
  testTimeout: 10000,
  verbose: true
};
