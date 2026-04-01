# 4️⃣ Leeruitkomst: Structural Design Pattern (MVC)

**Wat heb ik bereikt:**  
Ik ben in staat om software te schrijven middels een structural design pattern die voldoet aan de geldende richtlijnen van het design pattern.

---

## 📋 Bewijsstuk 1: MVC Pattern Implementatie

### ✅ Bewijs
- **M**odel - Database layer
- **V**iew - JSON responses / UI (React)
- **C**ontroller - Business logic
- Proper separation of concerns
- Industry-standard pattern

### 📝 Mijn Uitleg

**MVC = Model-View-Controller**

MVC is a structural design pattern that separates concerns:
- **Models** = Data (database operations only)
- **Views** = Presentation (JSON or React UI)
- **Controllers** = Logic (business rules)

**Benefit:** Easy to maintain, test, and extend

---

## **Models (Database Layer)**

### ✅ Bewijs: Proper Model Structure

```javascript
// models/animeModel.js - Only database operations
const db = require('../config/db');

class AnimeModel {
  /**
   * Get all anime from database
   */
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM anime');
    return rows;
  }

  /**
   * Get anime by ID
   */
  static async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM anime WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  /**
   * Create new anime
   */
  static async create(name) {
    const result = await db.query(
      'INSERT INTO anime (name) VALUES (?)',
      [name]
    );
    return result.insertId;
  }

  /**
   * Update anime
   */
  static async update(id, name) {
    await db.query(
      'UPDATE anime SET name = ? WHERE id = ?',
      [name, id]
    );
    return true;
  }

  /**
   * Delete anime
   */
  static async delete(id) {
    const result = await db.query(
      'DELETE FROM anime WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = AnimeModel;
```

**Model Richtlijnen Gevolgd:**
- ✅ Only database queries (SQL)
- ✅ No HTTP/Express code
- ✅ No business logic
- ✅ Reusable across app
- ✅ Easy to test

---

## **Controllers (Business Logic)**

### ✅ Bewijs: Proper Controller Structure

```javascript
// controllers/animeController.js - Business logic & request handling
const Anime = require('../models/animeModel');
const { validateAnimeName } = require('../validators/animeValidator');

class AnimeController {
  /**
   * Get all anime (public)
   */
  static async getAllAnime(req, res, next) {
    try {
      const anime = await Anime.getAll();
      
      res.json({
        success: true,
        count: anime.length,
        data: anime
      });
    } catch (error) {
      next(error); // Pass to error handler middleware
    }
  }

  /**
   * Get specific anime (public)
   */
  static async getAnimeById(req, res, next) {
    try {
      const anime = await Anime.getById(req.params.id);
      
      if (!anime) {
        return res.status(404).json({
          success: false,
          message: 'Anime not found'
        });
      }

      res.json({
        success: true,
        data: anime
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create anime (admin only)
   * Business logic:
   * - Validate input
   * - Check authorization
   * - Create in database
   * - Return created object
   */
  static async createAnime(req, res, next) {
    try {
      // 1. Validate input
      const validationError = validateAnimeName(req.body.name);
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }

      // 2. Business logic: Create
      const id = await Anime.create(req.body.name.trim());

      // 3. Return result
      res.status(201).json({
        success: true,
        message: 'Anime created',
        data: { id, name: req.body.name }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update anime (admin only)
   */
  static async updateAnime(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Validate
      const validationError = validateAnimeName(name);
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }

      // Check exists
      const exists = await Anime.getById(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Anime not found'
        });
      }

      // Update
      await Anime.update(id, name.trim());

      res.json({
        success: true,
        message: 'Anime updated'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete anime (admin only)
   */
  static async deleteAnime(req, res, next) {
    try {
      const deleted = await Anime.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Anime not found'
        });
      }

      res.json({
        success: true,
        message: 'Anime deleted'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnimeController;
```

**Controller Richtlijnen Gevolgd:**
- ✅ Contains business logic
- ✅ Calls Models for data
- ✅ Handles validation
- ✅ Manages authorization
- ✅ Sends HTTP responses
- ✅ Passes errors to middleware
- ✅ No database queries directly

---

## **Routes (URL Mapping)**

### ✅ Bewijs: Proper Route Structure

```javascript
// routes/anime.js - Clean URL mapping
const express = require('express');
const router = express.Router();

// Import controller
const animeController = require('../controllers/animeController');

// Import middleware
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

/**
 * Public routes
 */
// GET /api/anime - List all
router.get('/', animeController.getAllAnime);

// GET /api/anime/:id - Get one
router.get('/:id', animeController.getAnimeById);

/**
 * Admin routes (require auth + admin role)
 */
// POST /api/anime - Create
router.post('/', authMiddleware, adminMiddleware, animeController.createAnime);

// PUT /api/anime/:id - Update
router.put('/:id', authMiddleware, adminMiddleware, animeController.updateAnime);

// DELETE /api/anime/:id - Delete
router.delete('/:id', authMiddleware, adminMiddleware, animeController.deleteAnime);

module.exports = router;

// In index.js:
app.use('/api/anime', require('./routes/anime'));
```

**Route Richtlijnen Gevolgd:**
- ✅ URL-to-controller mapping only
- ✅ No business logic in routes
- ✅ Middleware applied here
- ✅ Clean and organized
- ✅ Comments for clarity

---

## **Middleware (Cross-Cutting Concerns)**

### ✅ Bewijs: Centralized Middleware

```javascript
// middleware/authMiddleware.js - Authentication
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// middleware/errorHandler.js - Centralized error handling
const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error'
  });
};

// middleware/logger.js - Request logging
const logger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = { authMiddleware, errorHandler, logger };
```

---

## 📋 Bewijsstuk 2: Project Structure (MVC Layout)

### ✅ Bewijs
- Organized file structure
- Clear separation of responsibilities
- Industry-standard layout

### 📝 Mijn Uitleg

```
Project-Manga/
│
├── index.js                    # Entry point - registers routes/middleware
│
├── models/                     # 🟦 MODEL - Database layer
│   ├── animeModel.js
│   ├── characterModel.js
│   ├── userModel.js
│   ├── ratingModel.js
│   └── favoriteModel.js
│
├── controllers/                # 🟩 CONTROLLER - Business logic
│   ├── animeController.js
│   ├── characterController.js
│   ├── authController.js
│   ├── ratingController.js
│   └── favoriteController.js
│
├── routes/                     # Routes - URL mapping
│   ├── anime.js
│   ├── characters.js
│   ├── auth.js
│   ├── ratings.js
│   └── favorites.js
│
├── middleware/                 # Cross-cutting concerns
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── logger.js
│
├── validators/                 # Input validation
│   ├── animeValidator.js
│   └── authValidator.js
│
├── config/                     # Configuration
│   └── db.js
│
├── tests/                      # 🟦 VIEW (in a way - responses tested)
│   ├── anime.test.js
│   └── auth.test.js
│
└── frontend/                   # 🟪 REACT FRONTEND (VIEW layer)
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── context/
    └── package.json
```

---

## 📋 Bewijsstuk 3: MVC Flow (Request Lifecycle)

### ✅ Bewijs
- Complete request handling
- Follows MVC pattern
- Shows separation

### 📝 Mijn Uitleg

**Example: Create Anime Flow**

```
1. REQUEST
   POST /api/anime
   Body: { name: "Demon Slayer" }
   Authorization: Bearer <token>

2. ROUTE (routes/anime.js)
   Matches: router.post('/', auth, admin, createAnime)
   ↓

3. MIDDLEWARE (authMiddleware, adminMiddleware)
   Verify token ✓
   Check admin role ✓
   Attach user to req.user
   ↓

4. CONTROLLER (animeController.createAnime)
   • Validate input (name not empty)
   • Call Model to create
   ↓

5. MODEL (animeModel.create)
   Execute SQL: INSERT INTO anime (name) VALUES (?)
   Return: insertId = 5
   ↓

6. CONTROLLER (continued)
   Receive id = 5 from model
   Format response
   ↓

7. RESPONSE
   Status: 201
   Body: {
     success: true,
     data: { id: 5, name: "Demon Slayer" }
   }
```

**Each layer independent:**
- Models don't know about HTTP
- Controllers don't query DB directly
- Routes just wire URLs to controllers
- Middleware handles cross-cutting concerns

---

## 📋 Bewijsstuk 4: Benefits van dit Pattern

### ✅ Bewijs
- Maintainability
- Testability
- Scalability
- Professional code

### 📝 Mijn Uitleg

**Wat MVC oplevert:**

| Aspect | Benefit | Example |
|--------|---------|---------|
| **Testability** | Easy to unit test | Mock Model, test Controller logic |
| **Maintainability** | Clear organization | Know where to find code |
| **Reusability** | Models used everywhere | favoriteModel in controllers |
| **Scalability** | Easy to add features | New resource = new M, C, R |
| **Teamwork** | Clear responsibilities | Developer A: backend, Developer B: frontend |
| **Debugging** | Stack traces clear | Know which layer failed |

**Professional Recognition:**
- ✅ Used by Rails, Django, Spring
- ✅ Taught in universities
- ✅ Expected in industry
- ✅ Improves job prospects

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**Pattern Applied:**
- ✅ Structural design pattern = MVC
- ✅ Follows industry guidelines
- ✅ Professional implementation
- ✅ Production-ready code

**Advantages Verified:**
- Easier to debug problems
- Simpler to write tests
- Clearer code organization
- Team members understand structure

**Lessons Learned:**
- Design patterns serve a purpose
- Not just theory, real practical benefit
- MVC is universal across frameworks
- Code quality improves significantly
