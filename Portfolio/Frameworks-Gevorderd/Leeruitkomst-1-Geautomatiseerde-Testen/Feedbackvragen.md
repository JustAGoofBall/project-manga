# ❓ Feedbackvragen - Leeruitkomst 1: Geautomatiseerde Testen

## Vraag 1: Test Strategy & Coverage
**Hoe robuust en compleet is mijn test suite voor een production applicatie?**

### 📌 Bewijslast in Project:
- **Test Suite**: [tests/anime.test.js](../../../../tests/anime.test.js), [tests/auth.test.js](../../../../tests/auth.test.js), [tests/characters.test.js](../../../../tests/characters.test.js), [tests/ratings.test.js](../../../../tests/ratings.test.js), [tests/favorites.test.js](../../../../tests/favorites.test.js)
- **Coverage Report**: [coverage/lcov-report/index.html](../../../../coverage/lcov-report/index.html)
- **Coverage Stats**: 85% statements, 80% branches, 90% functions, 85% lines
- **Test Count**: 60+ passing tests (run `npm test`)
- **Test Types**: Unit tests (validators), integration tests (endpoints), error tests
- **Test Output**: [test-results.txt](../../../../test-results.txt)

### Vragen:
- Heb ik voldoende coverage (ik heb 80%+) voor alle critical paths?
- Welke soorten tests missen nog? (mutations, load testing, contract testing)
- Hoe kan ik mijn coverage naar 90%+ brengen?

---

## Vraag 2: Test Quality & Maintenance
**Zijn mijn tests goed geschreven en makkelijk te onderhouden?**

### 📌 Bewijslast in Project:
- **Test Structure**: Organized describe blocks per endpoint/feature
- **Clear Assertions**: expect().toBe(), expect().toContain() - readable test code
- **Setup/Teardown**: Proper initalization in beforeAll/beforeEach
- **Naming**: Descriptive test names: "should return 404 when anime not found"
- **Configuration**: [jest.config.js](../../../../jest.config.js) - proper test setup
- **Comments**: Tests zijn self-documenting

### Vragen:
- Hoe kan ik mijn testcode nog beter structureren en documenteren?
- Zijn mijn tests DRY? Heb ik helpers nodig voor repetitieve testcode?
- Hoe kan ik mijn tests sneller en efficiënter maken?

---

*Sturen naar: Docent Frameworks-Gevorderd / Timo & Samir*
