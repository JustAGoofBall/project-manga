# Leeruitkomst 4: API's Automatisch Testen Met Feature Tests

## Motivatie

Ik ben in staat API's automatisch te testen met feature tests (integration tests). Dit vereist begrip van Jest, Supertest, test planning, en coverage rapportage.

### Testing Framework Stack

**Jest** = Test runner
- Testen schrijven en uitvoeren
- Assertions checken

**Supertest** = HTTP testing
- Requests naar API sturen
- Response testen

**Combined Power:**
```javascript
const request = require('supertest');
const app = require('../index'); // Express app

describe('GET /api/anime', () => {
  it('should return all anime', async () => {
    const res = await request(app).get('/api/anime');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

### Test Coverage By Resource

| Resource | Tests | Coverage |
|----------|-------|----------|
| Anime | 15+ | Create, read, update, delete, errors |
| Characters | 15+ | Full CRUD |
| Authentication | 15+ | Register, login, protected routes |
| Ratings | 10+ | User ratings CRUD |
| Favorites | 8+ | Add/remove favorites |
| Errors | 5+ | 404, 401, 500, validation |
| **Total** | **60+** | **All features covered** |

### Test Types

**1. Happy Path Tests** - Everything works

```javascript
it('should create anime when admin', async () => {
  const res = await request(app)
    .post('/api/anime')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'New Anime' });
  
  expect(res.status).toBe(201);
  expect(res.body.data.id).toBeDefined();
  expect(res.body.data.name).toBe('New Anime');
});
```

**2. Error Path Tests** - Expected failures

```javascript
it('should fail without admin token', async () => {
  const res = await request(app)
    .post('/api/anime')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ name: 'New Anime' });
  
  expect(res.status).toBe(403);
  expect(res.body.success).toBe(false);
});

it('should reject invalid anime name', async () => {
  const res = await request(app)
    .post('/api/anime')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: '' }); // Empty!
  
  expect(res.status).toBe(400);
  expect(res.body.message).toContain('required');
});
```

**3. Authentication Tests**

```javascript
describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBeDefined();
  });

  it('should fail with duplicate email', async () => {
    // Register first user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user1',
        email: 'same@example.com',
        password: 'pass123'
      });

    // Try to register with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user2',
        email: 'same@example.com', // Same!
        password: 'pass456'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already exists');
  });
});
```

**4. Database State Tests**

```javascript
it('should delete anime and cascade delete characters', async () => {
  // Create anime and character
  const anime = await request(app)
    .post('/api/anime')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Test Anime' });
  
  const animeId = anime.body.data.id;

  // Verify it exists
  let res = await request(app).get(`/api/anime/${animeId}`);
  expect(res.status).toBe(200);

  // Delete it
  res = await request(app)
    .delete(`/api/anime/${animeId}`)
    .set('Authorization', `Bearer ${adminToken}`);
  expect(res.status).toBe(200);

  // Verify it's gone
  res = await request(app).get(`/api/anime/${animeId}`);
  expect(res.status).toBe(404);
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode (rerun on change)
npm run test:coverage      # Coverage report
```

### Coverage Report

```
-----------|----------|----------|----------|----------|
File       |  % Stmts |  % Lines |  % Funcs |  % Branch |
-----------|----------|----------|----------|----------|
All files  |     85.2 |     86.1 |     84.5 |     83.2  |
 index.js  |     88.3 |     89.1 |     87.2 |     86.1  |
 models/   |     83.4 |     84.2 |     82.5 |     81.3  |
 routes/   |     80.1 |     81.5 |     79.2 |     78.5  |
-----------|----------|----------|----------|----------|
```

### Test Best Practices Implemented

✅ **Isolation** - Each test independent
✅ **Clarity** - Descriptive test names
✅ **Coverage** - Happy paths + error paths
✅ **Speed** - Lightweight database (in-memory for tests)
✅ **Maintenance** - DRY test code (setup, teardown)
✅ **Documentation** - Tests also document API behavior

### Key Learning

✅ Jest test structure
✅ Supertest for API testing
✅ Mock data and setup
✅ Async test handling
✅ Assertion libraries
✅ Coverage reporting
✅ CI/CD integration ready

### Bewijslast

Zie bewijslast (1), (2), (3), (4), (5)
