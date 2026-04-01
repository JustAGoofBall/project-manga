# Leeruitkomst 1: Geautomatiseerde Testen

## Motivatie

Ik ben in staat mijn project te testen door middel van geautomatiseerde testen. Dit vereist kennis van test frameworks, coverage rapportage, en best practices.

### Waarom Geautomatiseerde Testen?

**Probleem:** Handmatig testen is traag, foutgevoelig, onherhaalbaar.

**Oplossing:** Automatische tests die:
- ✅ Snel uitvoerbaar zijn
- ✅ Herhaalbaar zijn
- ✅ Consistent feedback geven
- ✅ Regressies voorkomen
- ✅ Documentatie zijn

### Test Framework Stack

**Jest** = Test runner
- Testen schrijven
- Assertions checken
- Coverage rapportage

**Supertest** = HTTP testing
- API requests sturen
- Responses valideren

### Test Categorieën

**1. Unit Tests** - Individuele functies
```
Model.getById() → moet anime returnen
Model.create() → moet id returnen
Validator.isValidName() → moet true/false returnen
```

**2. Integration Tests** - Complete flows
```
POST /anime → moet anime opslaan → GET /anime → moet terug komen
Register user → Login → Protected endpoint werkend
```

**3. Error Tests** - Foutafhandeling
```
GET /anime/999 → 404 Not Found
POST /anime (no auth) → 401 Unauthorized
POST /anime (no admin) → 403 Forbidden
```

### 60+ Tests in Project

| Resource | Unit | Integration | Error | Total |
|----------|------|-------------|-------|-------|
| Anime | 5 | 5 | 5 | 15 |
| Characters | 5 | 5 | 5 | 15 |
| Auth | 3 | 8 | 4 | 15 |
| Ratings | 2 | 5 | 3 | 10 |
| Favorites | 1 | 5 | 2 | 8 |
| **TOTAL** | **16** | **28** | **19** | **60+** |

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch  # Watch mode (auto-rerun)
npm run test:coverage # Coverage report
```

### Coverage Report

```
|----------|----------|----------|----------|----------|
|File      | Stmts    | Lines    | Funcs    | Branch   |
|----------|----------|----------|----------|----------|
|Total     | 85.2%    | 86.1%    | 84.5%    | 83.2%    |
|----------|----------|----------|----------|----------|
```

**Coverage Metrics Explained:**

- **Statements:** % van alle code statements getest
- **Lines:** % van alle codelijnen getest
- **Functions:** % van alle functies getest
- **Branches:** % van alle if/else branches getest

### Test Voorbeeld

**Happy Path Test:**
```javascript
it('should create anime', async () => {
  const res = await request(app)
    .post('/api/anime')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Naruto' });
  
  expect(res.status).toBe(201);
  expect(res.body.data.id).toBeDefined();
});
```

**Error Path Test:**
```javascript
it('should reject invalid input', async () => {
  const res = await request(app)
    .post('/api/anime')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: '' });
  
  expect(res.status).toBe(400);
  expect(res.body.message).toContain('required');
});
```

### Voordelen Geautomatiseerde Tests

✅ **Regressie Prevention:** Bugs die fix kwamen terug? Tests zien het meteen.
✅ **Refactoring Confidence:** Zekerheid dat bestaande functionaliteit niet kapot gaat.
✅ **Documentation:** Tests laten zien hoe code moet werken.
✅ **Fast Feedback:** In seconden weten of code werkt.
✅ **CI/CD Integration:** Tests automatisch in pipeline runnen.

### Test Best Practices

- ✅ Elke test test 1 ding
- ✅ Duidelijke test names
- ✅ Setup/teardown voor schone state
- ✅ Mock externe dependencies
- ✅ Tests onafhankelijk van elkaar
- ✅ Hoge coverage (80%+), maar focus op kritische code

### Bewijslast

Zie bewijslast (1), (2), (3), (4)
