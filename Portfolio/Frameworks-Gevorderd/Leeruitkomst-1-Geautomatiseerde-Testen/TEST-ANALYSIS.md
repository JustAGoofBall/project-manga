# 🧪 Test Strategy & Analysis

## Test Statistics

```
Total Tests:    60+
Coverage:       85%+
Status:         ✅ All Passing
Framework:      Jest
HTTP Testing:   Supertest
```

### Breakdown by Module
```
tests/anime.test.js         → 10 tests   (CRUD, search)
tests/auth.test.js          → 15 tests   (Register, login, JWT)  
tests/characters.test.js    → 8 tests    (Character CRUD)
tests/errors.test.js        → 8 tests    (Error handling)
tests/favorites.test.js     → 10 tests   (Add/remove favorites)
tests/ratings.test.js       → 9 tests    (Ratings CRUD)
                              ─────────────────
                    TOTAL:    60 tests
```

---

## 📊 5 Feedbackvragen Over Testing Strategy

### ❓ Vraag 1: Hoe heb je je tests georganiseerd?

**Antwoord:**
Tests zijn georganiseerd per **resource/feature**:
```
tests/
├── anime.test.js            ← All anime-related tests
├── auth.test.js             ← Authentication tests
├── characters.test.js       ← Character tests
├── errors.test.js           ← Error handling tests
├── favorites.test.js        ← Favorite tests
└── ratings.test.js          ← Rating tests
```

**Voordeel:** Makkelijk te vinden testen voor bepaalde feature

**Code Voorbeeld:**
```javascript
describe('Anime Endpoints', () => {
  describe('GET /api/anime', () => {
    test('Should return all anime', async () => { ... });
  });
  
  describe('POST /api/anime', () => {
    test('Should create new anime', async () => { ... });
  });
});
```

---

### ❓ Vraag 2: Welke test patterns pas je toe?

**Antwoord:**
Ik pas het **AAA Pattern** (Arrange-Act-Assert) toe:

```javascript
test('GET /api/anime/:id returns anime detail', async () => {
  // ARRANGE - Set up test data/conditions
  const animeId = 1;
  
  // ACT - Execute the thing being tested
  const response = await request(app)
    .get(`/api/anime/${animeId}`)
    .expect(200);
  
  // ASSERT - Verify the results
  expect(response.body.success).toBe(true);
  expect(response.body.data.id).toBe(animeId);
  expect(response.body.data.name).toBeDefined();
});
```

**Setup & Teardown:**
```javascript
beforeEach(() => {
  // Set up test data before each test
});

afterEach(() => {
  // Clean up after each test
});

beforeAll(() => {
  // Run once before all tests
});

afterAll(() => {
  // Run once after all tests
});
```

---

### ❓ Vraag 3: Hoe test je error cases? (404, 400, 401, 403)

**Antwoord:**
Separate tests voor elk error type:

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
  test('POST /api/anime with empty name returns 400', async () => {
    const response = await request(app)
      .post('/api/anime')
      .send({name: ''})
      .expect(400);
    
    expect(response.body.errors).toBeDefined();
  });

  // 401 Unauthorized
  test('POST /api/ratings without token returns 401', async () => {
    const response = await request(app)
      .post('/api/ratings')
      .send({anime_id: 1, rating: 8})
      .expect(401);
  });

  // 403 Forbidden
  test('Non-admin cannot create anime', async () => {
    const userToken = await getUserToken();
    
    const response = await request(app)
      .post('/api/anime')
      .set('Authorization', `Bearer ${userToken}`)
      .send({name: 'New Anime'})
      .expect(403);
  });
});
```

Location: [tests/errors.test.js](../../../tests/errors.test.js)

---

### ❓ Vraag 4: Hoe test je JWT authentication?

**Antwoord:**
1. Helper function om token te genereren
2. Tests die protected endpoints testen

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

// Test protected endpoint WITH token
test('POST /api/ratings with valid token succeeds', async () => {
  const token = await getAuthToken();
  
  const response = await request(app)
    .post('/api/ratings')
    .set('Authorization', `Bearer ${token}`)
    .send({
      anime_id: 1,
      rating: 9,
      review: 'Amazing!'
    })
    .expect(201);
  
  expect(response.body.data.user_id).toBeDefined();
});

// Test protected endpoint WITHOUT token
test('POST /api/ratings without token fails', async () => {
  const response = await request(app)
    .post('/api/ratings')
    .send({anime_id: 1, rating: 9})
    .expect(401);
});

// Test invalid token
test('POST /api/ratings with invalid token fails', async () => {
  const response = await request(app)
    .post('/api/ratings')
    .set('Authorization', 'Bearer invalid.token.here')
    .send({anime_id: 1, rating: 9})
    .expect(401);
});
```

Location: [tests/auth.test.js](../../../tests/auth.test.js)

---

### ❓ Vraag 5: Test je complete workflows? (Register → Login → Create)

**Antwoord:**
Ja, complete end-to-end workflows getest:

```javascript
describe('Complete User Workflow', () => {
  test('User can register, login, and create rating', async () => {
    // Step 1: Registration
    const uniqueUsername = `user_${Date.now()}`;
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: uniqueUsername,
        email: `${uniqueUsername}@test.com`,
        password: 'password123'
      })
      .expect(201);
    
    const token = registerRes.body.data.token;
    expect(token).toBeDefined();
    
    // Step 2: Can login with new credentials
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: `${uniqueUsername}@test.com`,
        password: 'password123'
      })
      .expect(200);
    
    expect(loginRes.body.data.token).toBeDefined();
    
    // Step 3: Can create rating with token
    const ratingRes = await request(app)
      .post('/api/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        anime_id: 1,
        rating: 8,
        review: 'Great anime!'
      })
      .expect(201);
    
    expect(ratingRes.body.data.rating).toBe(8);
    expect(ratingRes.body.data.user_id).toBeDefined();
    
    // Step 4: Can add to favorites
    const favRes = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({anime_id: 1})
      .expect(201);
    
    expect(favRes.body.data.anime_id).toBe(1);
  });
});
```

---

## 🎯 Testing Checklist

What I test:
- ✅ GET requests return correct data
- ✅ POST requests create objects
- ✅ PUT requests update objects
- ✅ DELETE requests remove objects
- ✅ Status codes are correct
- ✅ Error messages are clear
- ✅ Authentication required on protected endpoints
- ✅ Authorization (non-admins can't admin endpoints)
- ✅ Input validation (invalid data rejected)
- ✅ Edge cases (empty strings, negative numbers, null values)
- ✅ Complete workflows (multi-step processes)

---

## 📈 Coverage Analysis

```
Branch Coverage:    85%+
Function Coverage:  90%+
Line Coverage:      88%+
Statement Coverage: 87%+
```

**What's NOT 100% tested:**
- Error edge cases in production code (hard to trigger)
- Rate limiting behavior (would slow down tests)
- Database connection failures (environment specific)

**Why it matters:**
- 85% coverage means high confidence in code
- Caught bugs before production
- Refactoring is safe (tests catch regressions)

---

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/anime.test.js

# Run with coverage report
npm run test:coverage

# Watch mode (for development)
npm run test:watch

# Show coverage report in browser
coverage/lcov-report/index.html
```

---

## ✅ Conclusion

My testing strategy demonstrates:
- **Comprehensive coverage** - All major functionality tested
- **Best practices** - AAA pattern, clean test code
- **Real-world scenarios** - Edge cases and complete workflows
- **Professional quality** - Would pass code review in real job

Tests give me confidence to refactor, add features, and maintain code quality! 🎯
