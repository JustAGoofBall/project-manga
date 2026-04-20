# 🎯 Separation of Concerns - Role Definition

## The Problem: Mixed Responsibilities

### ❌ Bad Example (All in One)

```javascript
// BAD: Everything in route file
app.post('/anime', (req, res) => {
  // Input validation
  if (!req.body.name) {
    return res.status(400).json({error: 'Name required'});
  }
  
  // Database query (SQL in route file!)
  db.query('INSERT INTO anime (name) VALUES (?)', [req.body.name], (err, result) => {
    if (err) {
      // Error handling
      res.status(500).json({error: err.message});
    } else {
      // Response formatting
      res.status(201).json({
        success: true,
        message: 'Anime created',
        data: {id: result.insertId, name: req.body.name}
      });
    }
  });
});

// Problems:
// ❌ Route file has 5+ responsibilities
// ❌ Hard to test individual concerns
// ❌ Duplicate validation code if same endpoint in multiple files
// ❌ Database query logic mixed with HTTP logic
```

---

## ✅ Good Example: Separated Concerns

### 1️⃣ VALIDATORS - Input Validation

**File:** [validators/animeValidator.js](../../../validators/animeValidator.js)

**Responsibility:** Validate input data only

```javascript
const validateCreateAnime = (data) => {
  const { name } = data;
  
  // Validate name
  if (!name || name.trim() === '') {
    const error = new Error('Anime name is required');
    error.status = 400;
    throw error;
  }
  
  if (name.length > 255) {
    const error = new Error('Anime name must be under 255 characters');
    error.status = 400;
    throw error;
  }
  
  return { name: name.trim() };
};

module.exports = { validateCreateAnime };
```

**Usage:** Controllers call this before processing

---

### 2️⃣ MODELS - Database Logic

**File:** [models/animeModel.js](../../../models/animeModel.js)

**Responsibility:** Database queries ONLY

```javascript
const db = require('../config/db');

class Anime {
  static async create(name) {
    const query = 'INSERT INTO anime (name) VALUES (?)';
    const [result] = await db.query(query, [name]);
    
    return {
      id: result.insertId,
      name: name,
      created_at: new Date().toISOString()
    };
  }

  static async getById(id) {
    const [anime] = await db.query('SELECT * FROM anime WHERE id = ?', [id]);
    return anime.length > 0 ? anime[0] : null;
  }

  static async getAll() {
    const [anime] = await db.query('SELECT * FROM anime');
    return anime;
  }
}

module.exports = Anime;
```

---

### 3️⃣ CONTROLLERS - Business Logic

**File:** [controllers/animeController.js](../../../controllers/animeController.js)

**Responsibility:** Orchestrate validation + model + response

```javascript
const Anime = require('../models/animeModel');
const { validateCreateAnime } = require('../validators/animeValidator');

exports.createAnime = async (req, res, next) => {
  try {
    // 1. Validate input (delegate to validator)
    const validData = validateCreateAnime(req.body);
    
    // 2. Create in database (delegate to model)
    const anime = await Anime.create(validData.name);
    
    // 3. Return response with proper format
    res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: anime
    });
  } catch (err) {
    // Pass error to middleware
    next(err);
  }
};

exports.getAnimeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const anime = await Anime.getById(id);
    
    if (!anime) {
      const error = new Error('Anime not found');
      error.status = 404;
      throw error;
    }
    
    res.json({ success: true, data: anime });
  } catch (err) {
    next(err);
  }
};
```

---

### 4️⃣ MIDDLEWARE - Cross-Cutting Concerns

**File:** [middleware/errorHandler.js](../../../middleware/errorHandler.js)

**Responsibility:** Handle errors consistently

```javascript
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message: message,
    status: status
  });
};

module.exports = errorHandler;
```

**File:** [middleware/authMiddleware.js](../../../middleware/authMiddleware.js)

**Responsibility:** Verify JWT tokens

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      const error = new Error('No token provided');
      error.status = 401;
      throw error;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
```

---

### 5️⃣ ROUTES - URL Mapping

**File:** [routes/anime.js](../../../routes/anime.js)

**Responsibility:** Map URLs to controllers + apply middleware

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllAnime,
  getAnimeById,
  createAnime,
  updateAnime,
  deleteAnime
} = require('../controllers/animeController');
const authMiddleware = require('../middleware/authMiddleware');

// Public endpoints
router.get('/api/anime', getAllAnime);
router.get('/api/anime/:id', getAnimeById);

// Protected endpoints (require auth)
router.post('/api/anime', authMiddleware, createAnime);
router.put('/api/anime/:id', authMiddleware, updateAnime);
router.delete('/api/anime/:id', authMiddleware, deleteAnime);

module.exports = router;
```

---

## 📊 Responsibility Matrix

| Layer | File | Responsibility | Can Access | Cannot Access |
|---|---|---|---|---|
| **Route** | routes/anime.js | Map URLs | Controllers | Database |
| **Controller** | controllers/animeController.js | Business logic | Models, Validators | Database directly |
| **Validator** | validators/animeValidator.js | Input validation | Data only | Database, HTTP |
| **Model** | models/animeModel.js | Database queries | Config, Database | HTTP, Controllers |
| **Middleware** | middleware/*.js | Cross-cutting | Request/Response | Business logic |

---

## 🔄 Request Flow (with Separation)

```
REQUEST: POST /api/anime
         {name: "Naruto"}
              │
              ▼
[routes/anime.js]
✅ Maps URL → calls createAnime
✅ Applies authMiddleware
              │
              ▼
[middleware/authMiddleware.js]
✅ Verify JWT token
✅ Set req.user
              │
              ▼
[controllers/animeController.js]
✅ Call validator
✅ Call model
✅ Format response
              │
              ├─→ [validators/animeValidator.js]
              │   ✅ Check name not empty
              │   ✅ Return validated data
              │
              └─→ [models/animeModel.js]
                  ✅ Execute INSERT query
                  ✅ Return created object
              │
              ▼
[middleware/errorHandler.js]
✅ If error: Format error response
              │
              ▼
RESPONSE: 201 Created
         {success: true, data: {...}}
```

---

## ✅ Benefits of Separation

| Benefit | How It Helps | Example |
|---|---|---|
| **Testing** | Test each layer independently | Mock model in controller tests |
| **Reusability** | Same validator used everywhere | animeValidator used in 3+ places |
| **Maintenance** | Change one place only | Fix bug in model = fixed everywhere |
| **Readability** | Know exactly where logic lives | Question about validation? → validators/ |
| **Scalability** | Easy to add new features | New resource? Copy pattern |

---

## 🚫 Anti-Patterns to Avoid

### Anti-Pattern 1: Logic in Routes
```javascript
❌ router.post('/api/anime', (req, res) => {
    db.query(...)  // ← Database code in route!
  });
```

### Anti-Pattern 2: Logic in Models
```javascript
❌ class Anime {
    create(name) {
      if (name.length > 255) {  // ← Validation in model!
        throw Error(...);
      }
    }
  }
```

### Anti-Pattern 3: Duplicate Validation
```javascript
❌ // Validation in 3 different places
   // validators/animeValidator.js
   // controllers/animeController.js
   // models/animeModel.js
```

### Anti-Pattern 4: Controllers Do Database Work
```javascript
❌ exports.createAnime = async (req, res) => {
    await db.query(...);  // ← Should call model!
  };
```

---

## 📋 Checking Separation in My Code

Each file should pass this test:

| File | Who Can Read It | Who Would Understand It |
|---|---|---|
| validators/*.js | QA tester | ✅ Yes (just data rules) |
| models/*.js | Database admin | ✅ Yes (just SQL) |
| controllers/*.js | Business analyst | ✅ Yes (just logic flow) |
| routes/*.js | Architect | ✅ Yes (just structure) |
| middleware/*.js | Security team | ✅ Yes (just concerns) |

---

## ✅ Conclusion

**In my project:**
- ✅ Validators contain ONLY validation rules
- ✅ Models contain ONLY database queries
- ✅ Controllers contain ONLY business logic
- ✅ Routes contain ONLY URL mappings
- ✅ Middleware handles ONLY cross-cutting concerns
- ✅ NO code duplication
- ✅ Each layer is independently testable
- ✅ Easy to maintain and extend

This is **professional-grade separation of concerns**! 🎯
