# 🧪 Leeruitkomst 4: API's Automatisch Testen (Feature Tests)

## Wat Ik Toon
Ik demonstreer dat ik **geautomatiseerde feature tests** kan schrijven met Jest + Supertest:
- API endpoints testen
- Request/response validatie
- Success en error cases
- HTTP status codes verifiëren
- Complete workflows testen (e.g., register → login → create rating)

**Statistieken:**
- 60+ tests geschreven
- 85%+ code coverage
- Alle kritieke workflows getest
- Jest + Supertest framework

## Hoe Dit In Mijn Project Zichtbaar Is
- **Tests:** `/tests/` folder met `anime.test.js`, `auth.test.js`, `characters.test.js`, `errors.test.js`, `favorites.test.js`, `ratings.test.js`
- **Config:** [jest.config.js](../../../jest.config.js) configureert test environment
- **Coverage:** `npm run test:coverage` genereert coverage reports
- **Demonstratie:** Zie [TEST-ANALYSIS.md](TEST-ANALYSIS.md) voor vragen en analyse
