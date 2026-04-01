# Leeruitkomst 3: Scheiding van Verantwoordelijkheden

## Motivatie

Ik kan verantwoordelijkheden consistent scheiden in mijn code en begrijp het belang hiervan. Dit vereist begrijp van design patterns, clean code, en professionele architecture.

### Waarom Scheiding van Concerns?

**Probleem:** Code samenvoegen = spaghetti code
- Moeilijk: zoeken, testen, wijzigen
- Foutgevoelig: ene wijziging breekt ander
- Niet herbruikbaar: alles is afhankelijk

**Oplossing:** Duidelijke scheiding
- ✅ Gemakkelijk: weet waar te zoeken
- ✅ Testbaar: test elk stuk apart
- ✅ Herbruikbaar: componenten onafhankelijk

### MVC Architectuur in Project Manga

```
Request → Route → Controller → Model → Database
  ↓         ↓       ↓           ↓
 URL    Mapping  Business    SQL
Mapper  Handler  Logic      Queries
```

### Layer-By-Layer Verantwoordelijkheden

**ROUTES** - URL Mapping Alleen
```javascript
// ✅ GOED: Alleen routing
router.get('/:id', authMiddleware, animeController.getAnimeById);
router.post('/', authMiddleware, animeController.createAnime);
```

**CONTROLLERS** - Business Logic Alleen
```javascript
// ✅ GOED: Logica, GEEN SQL
exports.getAnimeById = async (req, res, next) => {
  try {
    // 1. Validate input
    if (!req.params.id) {
      return res.status(400).json({ success: false });
    }
    
    // 2. Get data from model
    const anime = await Anime.getById(req.params.id);
    
    // 3. Check result
    if (!anime) {
      return res.status(404).json({ success: false });
    }
    
    // 4. Return response (no SQL!)
    res.json({ success: true, data: anime });
  } catch (error) {
    next(error);
  }
};
```

**MODELS** - Database Queries Alleen
```javascript
// ✅ GOED: Alleen SQL, GEEN HTTP
static async getById(id) {
  const [anime] = await db.query(
    'SELECT * FROM anime WHERE id = ?',
    [id]
  );
  return anime[0] || null;
}
```

### Middleware for Cross-Cutting Concerns

✅ **Authentication** - Check JWT token
```javascript
// middleware/authMiddleware.js
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
next();
```

✅ **Error Handling** - Centralized
```javascript
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: 'Error' });
};
```

✅ **Logging** - Request/Response tracking
```javascript
// middleware/logger.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Validators - Input Validation

```javascript
// validators/animeValidator.js
// ✅ Reusable validation logic
exports.validateAnimeName = (name) => {
  if (!name) return 'Name is required';
  if (name.trim().length < 3) return 'Min 3 chars';
  return null;
};

// Used in controllers:
const error = validateAnimeName(req.body.name);
if (error) return res.status(400).json({ success: false, message: error });
```

### Project Structure Benefits

```
Models/           → Testable in isolation (no HTTP)
├── Unit tests  → Fast (no network)

Controllers/      → Testable with mock models
├── Mock models → Dependencies injected

Routes/           → Testable with mock controllers
├── Mock controllers

Middleware/       → Testable independently
├── Pass/fail through middleware

Validators/       → Pure functions
├── Easy to test
```

### Testing Each Layer

**Model Test:**
```javascript
// Pure database test, no HTTP
const anime = await Anime.getById(1);
expect(anime.id).toBe(1);
```

**Controller Test:**
```javascript
// Mock model, test logic
Anime.getById = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
await controllerFunction(req, res);
expect(res.status).toHaveBeenCalledWith(200);
```

**Integration Test:**
```javascript
// Full request/response cycle
const res = await request(app).get('/api/anime/1');
expect(res.status).toBe(200);
```

### Refactoring Example

**BEFORE** (Everything mixed):
```javascript
app.get('/anime/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send('Invalid ID');
  
  db.query('SELECT * FROM anime WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send('DB error');
    if (!result[0]) return res.status(404).send('Not found');
    res.json(result[0]);
  });
});
```

**AFTER** (Properly separated):
```javascript
// routes/anime.js
router.get('/:id', animeController.getAnimeById);

// controllers/animeController.js
exports.getAnimeById = async (req, res, next) => {
  const anime = await Anime.getById(req.params.id);
  if (!anime) return res.status(404).json({ success: false });
  res.json({ success: true, data: anime });
};

// models/animeModel.js
static async getById(id) {
  const [result] = await db.query('SELECT * FROM anime WHERE id = ?', [id]);
  return result[0] || null;
}
```

### Benefits Demonstrated

1. **Testability** - Each layer independently testable
2. **Reusability** - Models usable in multiple controllers
3. **Maintainability** - Clear where to look for bugs
4. **Scalability** - Easy to add new resources
5. **Clarity** - Code intent obvious from structure

### Bewijslast

Zie bewijslast (1), (2), (3), (4)
