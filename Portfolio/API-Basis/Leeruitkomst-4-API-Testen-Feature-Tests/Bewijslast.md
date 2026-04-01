# Bewijslast Leeruitkomst 4: API's Automatisch Testen

## Projecten

(1) Lit, J. (2026). Project Manga - 60+ automated feature tests with Jest + Supertest.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Test Suite Overview**
    - File: `/tests/anime.test.js` - 15+ anime endpoint tests
    - File: `/tests/characters.test.js` - 15+ character tests
    - File: `/tests/auth.test.js` - 15+ authentication tests
    - File: `/tests/ratings.test.js` - 10+ rating tests
    - File: `/tests/favorites.test.js` - 8+ favorite tests
    - File: `/tests/errors.test.js` - 5+ error handling tests
    - Total: 60+ tests, all passing

(3) **Test Types Implemented**
    - Happy path tests (normal flow)
    - Error path tests (validation, unauthorized, not found)
    - Authentication tests (register, login, token validation)
    - CRUD operation tests (Create, Read, Update, Delete)
    - Database relation tests (cascading deletes, foreign keys)

(4) **Jest & Supertest Framework**
    - File: `/jest.config.js` - Jest configuration
    - File: `/package.json` - Test scripts and dependencies
    - `npm test` - Run all tests
    - `npm run test:coverage` - Generate coverage report
    - All tests isolated and repeatable

(5) **Test Coverage Report**
    - File: `/coverage/lcov.info` - LCOV coverage format
    - File: `/coverage/lcov-report/index.html` - HTML report
    - 85%+ code coverage across all files
    - All critical paths tested

(6) **Test Patterns & Examples**
    - Request building with supertest
    - JWT token inclusion in requests
    - Response assertion patterns
    - Error case coverage
    - Database state verification before/after

(7) **CI/CD Ready**
    - Tests can run in pipeline
    - Exit codes indicate pass/fail
    - Coverage reports generated
    - No manual testing needed for API

## Feedback

[Nog in te vullen door Timo & Samir]
