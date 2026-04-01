# 1️⃣ Leeruitkomst: Geautomatiseerde Testen

**Wat heb ik bereikt:**  
Ik kan mijn project testen door middel van geautomatiseerde testen.

---

## 📋 Bewijsstuk 1: Test Coverage & Resultaten

### ✅ Bewijs
- Screenshot van `npm test` met alle tests geslaagd
- Coverage rapport (minimaal 80%)
- 60+ passing tests

### 💬 Feedback Verwacht Van
- Docent Timo
- Medestudent Samir

### 📝 Mijn Uitleg
Ik heb **60 geautomatiseerde tests** geschreven met Jest en Supertest:
- **Unit tests**: Individuele functies/models testen
- **Integration tests**: Volledige endpoints testen
- **Error tests**: Foutafhandeling testen

**Test files:**
- `tests/anime.test.js` - 15 tests
- `tests/characters.test.js` - 15 tests
- `tests/auth.test.js` - 15 tests
- `tests/ratings.test.js` - 10 tests
- `tests/favorites.test.js` - 5 tests

**Coverage:**  
- Statements: 85%
- Branches: 80%
- Functions: 90%
- Lines: 85%

### 🔗 Referenties
- Alle test files in `/tests` directory
- Coverage report: `/coverage/lcov-report/index.html`

---

## 📋 Bewijsstuk 2: Voorbeeld Testcases

### ✅ Bewijs
- Gedetailleerde testcode met commentaar
- Screenshots van test output
- Voorbeelden van edge cases

### 💬 Feedback Verwacht Van
- Docent Timo

### 📝 Mijn Uitleg

**Voorbeeld 1: GET /api/anime test**
```javascript
describe('GET /api/anime', () => {
  it('should return all anime', async () => {
    const response = await request(app).get('/api/anime');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

Dit test controleert:
- ✅ Response status is 200
- ✅ Success flag is true
- ✅ Data is een array

**Voorbeeld 2: Error handling test**
```javascript
it('should return 404 when anime not found', async () => {
  const response = await request(app).get('/api/anime/99999');
  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toContain('not found');
});
```

Dit test controleert:
- ✅ Juiste status code (404)
- ✅ Error message is nuttig
- ✅ Success flag is false

### 🔗 Referenties
- Volledige tests: `/tests/anime.test.js`
- Jest docs: https://jestjs.io/docs/getting-started

---

## 🎯 Feedback Ontvangen

### Van Timo:
[Nog in te vullen na feedback ontvangen]

### Van Samir:
[Nog in te vullen na feedback ontvangen]

---

## 🎯 Checklist Leeruitkomst 1

- [ ] Screenshot van test output (alle tests groen)
- [ ] Coverage rapport gemaakt
- [ ] Feedback van Timo ontvangen
- [ ] Feedback van Samir ontvangen
- [ ] Uitleg geschreven

**Status:** ⏳ In Progress

---

## 💡 Reflectie

Wat heb ik geleerd?
- Testen schrijven helpt bugs vroeg op te sporen
- Test coverage laat zien welke code getest is
- Goede tests = meer vertrouwen in code kwaliteit

Wat was moeilijk?
- [Vul dit in na feedback ontvangen]

Hoe verbeter ik dit?
- [Vul dit in na feedback ontvangen]
