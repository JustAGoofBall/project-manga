# 🧪 Test Analysis & Feature Coverage

## 📊 Test Statistieken

**Totaal:** 60+ tests  
**Coverage:** 85%+  
**Status:** ✅ Alle tests passing

### Test Breakdown Per Module
```
✅ anime.test.js        → 10 tests  (CRUD operations, search)
✅ auth.test.js         → 15 tests  (Register, login, JWT, permissions)
✅ characters.test.js   → 8 tests   (Character CRUD per anime)
✅ errors.test.js       → 8 tests   (Error handling, edge cases)
✅ favorites.test.js    → 10 tests  (Add/remove favorites, duplicates)
✅ ratings.test.js      → 9 tests   (Create/update/delete ratings)
                 ─────────────────
TOTAAL:                 60 tests
```

---

## 🎯 Feedbackvragen Over Testing

### ❓ Vraag 1: Test Coverage & Strategy
**"Wat is je test coverage percentage en hoe ben je tot dat percentage gekomen?"**

Antwoord: 85% coverage, bereikt door:
- Unit tests per controller method
- Integration tests voor volledige endpoints
- Edge case testing (invalid input, 404, 403)
- Database setup/teardown voor isolatie

Coverage rapport: [evidence/metrics/coverage.json](evidence/metrics/coverage.json)

---

### ❓ Vraag 2: Test Patterns & Best Practices
**"Welke test patterns pas je toe? (AAA pattern, DRY, setup/teardown)"**

Antwoord: Ik gebruik AAA pattern in alle tests:

```javascript
// Voorbeeld: AAA Pattern

describe('Anime API', () => {
  test('GET /api/anime/:id returns anime with characters', async () => {
    // ===== ARRANGE =====
    const animeId = 1;
    
    // ===== ACT =====
    const response = await request(app)
      .get(`/api/anime/${animeId}`)
      .expect(200);
    
    // ===== ASSERT =====
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(animeId);
    expect(response.body.data.characters).toBeDefined();
  });
});
```

Locatie: [tests/anime.test.js](../../../tests/anime.test.js)

---

### ❓ Vraag 3: Error Case Testing
**"Hoe test je error cases? (404, 400, 401, 403)"**

Antwoord: Separate tests per error type:

```javascript
describe('Error Handling', () => {
  // 404 Not Found
  test('GET /api/anime/999 returns 404', async () => {
    const response = await request(app)
      .get('/api/anime/999')
      .expect(404);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('not found');
  });

  // 400 Bad Request
  test('POST /api/anime with invalid data returns 400', async () => {
    const response = await request(app)
      .post('/api/anime')
      .send({ name: '' })  // Empty name
      .expect(400);
    
    expect(response.body.success).toBe(false);
  });

  // 401 Unauthorized
  test('POST /api/favorites without token returns 401', async () => {
    const response = await request(app)
      .post('/api/favorites')
      .send({ anime_id: 1 })
      .expect(401);
  });
});
```

Locatie: [tests/errors.test.js](../../../tests/errors.test.js)

---

### ❓ Vraag 4: JWT Authentication Testing
**"Hoe test je JWT authentication en authorization?"**

Antwoord: Helper function voor token generation + protected endpoint tests:

```javascript
// Helper function
async function getAuthToken() {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });
  return response.body.data.token;
}

// Usage in test
test('POST /api/ratings requires JWT token', async () => {
  const token = await getAuthToken();
  
  const response = await request(app)
    .post('/api/ratings')
    .set('Authorization', `Bearer ${token}`)  // ← JWT in header
    .send({
      anime_id: 1,
      rating: 9,
      review: 'Amazing!'
    })
    .expect(201);
});
```

Locatie: [tests/auth.test.js](../../../tests/auth.test.js), [tests/ratings.test.js](../../../tests/ratings.test.js)

---

### ❓ Vraag 5: End-to-End Workflow Testing
**"Test je volledige workflows? (Register → Login → Create Rating)"**

Antwoord: Ja, complete workflows getest:

```javascript
describe('Complete User Workflow', () => {
  test('User can register, login, and create rating', async () => {
    // Step 1: Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201);
    
    const token = registerRes.body.data.token;
    
    // Step 2: Create Rating (requires token from step 1)
    const ratingRes = await request(app)
      .post('/api/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        anime_id: 1,
        rating: 8,
        review: 'Great!'
      })
      .expect(201);
    
    expect(ratingRes.body.data.user_id).toBeDefined();
    expect(ratingRes.body.data.rating).toBe(8);
  });
});
```

---

## 📋 Hoe Tests Uit Te Voeren

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/anime.test.js

# Run with coverage report
npm run test:coverage

# Watch mode (for development)
npm run test:watch
```

---

## 🔍 Test Technologie Stack

| Tool | Versie | Doel |
|---|---|---|
| **Jest** | 30.2.0 | Test framework |
| **Supertest** | 7.2.2 | HTTP assertion library |
| **Node.js** | test environment | Test runner |
| **MySQL2** | (test database) | Test data storage |

---

## 📸 Evidence

Zie de volgende mappen voor:
- **screenshots/**: output van `npm test` en coverage rapporten
- **metrics/**: coverage percentages en test counts

Run `npm test` om live te zien dat alle tests passing zijn! ✅
