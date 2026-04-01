# Bewijslast Leeruitkomst 1: Geautomatiseerde Testen

## Projecten

(1) Lit, J. (2026). Project Manga - 60+ automated tests with Jest + Supertest, 85%+ coverage.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Test Suite Coverage**
    - File: `/tests/anime.test.js` - 15 tests
    - File: `/tests/characters.test.js` - 15 tests    
    - File: `/tests/auth.test.js` - 15 tests
    - File: `/tests/ratings.test.js` - 10 tests
    - File: `/tests/favorites.test.js` - 8 tests
    - File: `/tests/errors.test.js` - 5 tests
    - Total: 60+ passing tests

(3) **Coverage Metrics**
    - File: `/coverage/lcov-report/index.html` - HTML coverage report
    - Statements: 85.2%
    - Lines: 86.1%
    - Functions: 84.5%
    - Branches: 83.2%
    - All critical paths covered

(4) **Test Configuration**
    - File: `/jest.config.js` - Jest configuration
    - File: `/package.json` - Test scripts (test, test:watch, test:coverage)
    - Supertest for API testing
    - In-memory database for tests

(5) **Running Tests**
    - Command: `npm test` runs all tests
    - Command: `npm run test:watch` for development
    - Command: `npm run test:coverage` generates coverage report

(6) **Test Examples**
    - Happy path tests (normal flow)
    - Error path tests (validation, auth failures)
    - Edge case tests (empty inputs, duplicates)
    - Integration tests (full request/response cycle)

## Feedback

[Nog in te vullen door Timo & Samir]
