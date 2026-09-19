/**
 * Jest configuration.
 *
 * Note: Jest automatically sets NODE_ENV=test, which is what makes
 * config/db.js open the throwaway test database instead of the real one.
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],

  // Run test files one at a time. They share a single SQLite file,
  // so running them in parallel would make them fight over the same rows.
  maxWorkers: 1,

  coverageDirectory: 'coverage',
  // Measure coverage of the actual backend source, not the tests themselves.
  collectCoverageFrom: [
    'index.js',
    'config/**/*.js',
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'validators/**/*.js'
  ],

  testTimeout: 10000,
  verbose: true
};
