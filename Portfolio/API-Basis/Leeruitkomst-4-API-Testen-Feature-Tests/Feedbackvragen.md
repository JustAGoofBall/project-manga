# ❓ Feedbackvragen - Leeruitkomst 4: API Testen - Feature Tests

## Vraag 1: Test Coverage & Strategy
**Is mijn test strategie robuust en voldoende voor een production API?**

### 📌 Bewijslast in Project:
- **Test Files**: [tests/anime.test.js](../../../../tests/anime.test.js), [tests/auth.test.js](../../../../tests/auth.test.js), [tests/ratings.test.js](../../../../tests/ratings.test.js)
- **Coverage Report**: [coverage/lcov-report/index.html](../../../../coverage/lcov-report/index.html)
- **Coverage Metrics**: 
  - Statements: 85%
  - Branches: 80%
  - Functions: 90%
  - Lines: 85%
- **Test Count**: 60+ passing tests (run `npm test`)
- **Config**: [jest.config.js](../../../../jest.config.js)

### Vragen:
- Heb ik alle happy paths en error paths getest?
- Welke soorten tests zou ik nog moeten toevoegen?
- Hoe kan ik mijn coverage nog verbeteren?

---

## Vraag 2: Integratietesten Kwaliteit
**Hoe goed zijn mijn integratietesten die de volledige API-flow testen?**

### 📌 Bewijslast in Project:
- **Integration Tests**: [tests/anime.test.js](../../../../tests/anime.test.js) - GET/POST/PUT/DELETE flows
- **Auth Tests**: [tests/auth.test.js](../../../../tests/auth.test.js) - register + login flows
- **Edge Cases**: Tests voor invalid input, 404s, unauthorized requests
- **Test Output**: [test-results.txt](../../../../test-results.txt) - gedetailleerde test output

### Vragen:
- Test ik voldoende edge cases (invalid input, permissions, boundary values)?
- Zou ik end-to-end tests moeten toevoegen naast integratie tests?
- Zijn mijn tests onderhoudbaar en goed gedocumenteerd?

---

*Sturen naar: Docent API-Basis*
