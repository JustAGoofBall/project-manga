# 🏗️ MVC Architecture Explained

## 📊 MVC Folder Structure

```
Project-Manga/
│
├── /models                  ← MODEL LAYER
│   ├── animeModel.js       (Database queries for anime)
│   ├── characterModel.js   (Database queries for characters)
│   ├── userModel.js        (Database queries for users)
│   ├── ratingModel.js      (Database queries for ratings)
│   └── favoriteModel.js    (Database queries for favorites)
│
├── /controllers            ← CONTROLLER LAYER
│   ├── animeController.js  (Business logic for anime)
│   ├── characterController.js
│   ├── authController.js   (Auth logic)
│   ├── ratingController.js
│   └── favoriteController.js
│
├── /routes                 ← ROUTING LAYER
│   ├── anime.js           (GET /api/anime, POST /api/anime, etc)
│   ├── characters.js
│   ├── auth.js
│   ├── ratings.js
│   ├── favorites.js
│   ├── admin.js
│   └── search.js
│
├── /middleware            ← MIDDLEWARE LAYER
│   ├── authMiddleware.js  (JWT verification)
│   ├── errorHandler.js    (Error handling)
│   └── logger.js          (Request logging)
│
├── /validators            ← VALIDATION LAYER
│   ├── animeValidator.js  (Input validation)
│   ├── authValidator.js
│   ├── characterValidator.js
│   ├── ratingValidator.js
│   └── favoriteValidator.js
│
├── /config                ← CONFIGURATION
│   ├── db.js             (Database connection)
│   └── data.js           (Constants)
│
└── index.js               ← APPLICATION ENTRY POINT
```

---

## 🔄 Request Flow Through MVC

### Voorbeeld: GET /api/anime/1

```
1️⃣  REQUEST ARRIVES
    GET /api/anime/1
    
2️⃣  ROUTER MATCHES ROUTE
    [routes/anime.js]
    router.get('/:id', getAnimeById)
    
3️⃣  MIDDLEWARE EXECUTES (if defined)
    [middleware/authMiddleware.js] - Optional on this endpoint
    
4️⃣  CONTROLLER FUNCTION EXECUTES
    [controllers/animeController.js → getAnimeById()]
    ─ Extract ID from params: {id} = req.params
    ─ Call model method: Anime.getById(1)
    ─ Basic error checking
    
5️⃣  MODEL EXECUTES DATABASE QUERY
    [models/animeModel.js → getById(id)]
    ─ Query: SELECT * FROM anime WHERE id = ?
    ─ Return data from database
    
6️⃣  CONTROLLER FORMATS RESPONSE
    Back to [controllers/animeController.js]
    ─ Format: {success: true, data: {...}}
    ─ Status: 200 OK
    
7️⃣  RESPONSE SENT TO CLIENT
    {
      "success": true,
      "data": {
        "id": 1,
        "name": "Naruto",
        "created_at": "..."
      }
    }
```

---

## 🧩 MVC Layer Responsibilities

### MODEL LAYER
**File:** [models/animeModel.js](../../../models/animeModel.js)

**Responsibility:** Database operations only

```javascript
class Anime {
  // ✅ Do: Database queries
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM anime');
    return rows;
  }
  
  // ✅ Do: Data transformation from DB
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM anime WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
  
  // ❌ Don't: 
  // - Business logic (that's controller's job)
  // - Error handling with status codes (that's controller's job)
  // - HTTP responses (that's controller's job)
}
```

---

### CONTROLLER LAYER
**File:** [controllers/animeController.js](../../../controllers/animeController.js)

**Responsibility:** Business logic + Error handling

```javascript
exports.getAnimeById = async (req, res) => {
  try {
    // ✅ Do: Extract request data
    const { id } = req.params;
    
    // ✅ Do: Call model (don't write SQL here!)
    const anime = await Anime.getById(id);
    
    // ✅ Do: Business logic (error checking)
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    // ✅ Do: Send formatted response
    res.json({
      success: true,
      data: anime
    });
    
  } catch (err) {
    // ✅ Do: Error handling
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
```

---

### ROUTE LAYER
**File:** [routes/anime.js](../../../routes/anime.js)

**Responsibility:** URL mapping + Authentication

```javascript
const router = express.Router();
const { getAnimeById, createAnime, /* ... */ } = require('../controllers/animeController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Do: Map URLs to controllers
router.get('/:id', getAnimeById);
router.post('/', authMiddleware, createAnime);  // Protect with auth

// ❌ Don't:
// - Write SQL queries here
// - Put business logic here
// - Handle errors manually (controller does this)
```

---

### MIDDLEWARE LAYER
**File:** [middleware/authMiddleware.js](../../../middleware/authMiddleware.js)

**Responsibility:** Cross-cutting concerns

```javascript
const authMiddleware = (req, res, next) => {
  try {
    // ✅ Do: Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // ✅ Do: Verify and attach to request
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Usage in routes:
router.post('/api/favorites', authMiddleware, addFavorite);
//                             ↑
//                    Only authenticated users can add favorites
```

---

## 📋 Separation of Concerns Checklist

| Layer | What Goes Here | What Doesn't |
|---|---|---|
| **Model** | SELECT queries, INSERT queries, UPDATE queries | HTTP status codes, error messages, request validation |
| **Controller** | Business logic, error handling, response formatting | SQL queries, HTTP routing, middleware application |
| **Route** | URL patterns, HTTP methods, middleware application | SQL, business logic, response formatting |
| **Middleware** | Authentication, logging, rate limiting | Business logic specific to one resource |

---

## 🎯 Why MVC Pattern?

### ✅ Benefits Applied in This Project

1. **Reusability**
   - Same model can be used by multiple controllers
   - Example: animeModel.js used by animeController and searchController

2. **Maintenance**
   - To change database query: Edit models/ only
   - To change business logic: Edit controllers/ only
   - To add route: Edit routes/ only

3. **Testing**
   - Can test models independently (mock database)
   - Can test controllers independently (mock models)
   - Can test routes independently (mock controllers)

4. **Scalability**
   - Easy to add new resources (create new model/controller/route)
   - Easy to add new features
   - Code remains organized as project grows

---

## 🔗 Complete Example: Create Anime

```
REQUEST:
POST /api/anime
{ "name": "New Anime" }
───────────────────────────────────

[routes/anime.js]
✅ Router matches POST /api/anime → calls animeController.createAnime

[middleware/authMiddleware.js]
✅ Verifies JWT token is valid

[controllers/animeController.js]
✅ Validates: name is not empty
✅ Calls: Anime.create('New Anime')
✅ Formats response

[models/animeModel.js]
✅ Executes: INSERT INTO anime (name) VALUES ('New Anime')
✅ Returns: {id: 6, name: 'New Anime'}

[controllers/animeController.js]
✅ Sends: {success: true, data: {id: 6, name: 'New Anime'}} with 201 status

RESPONSE:
201 Created
{
  "success": true,
  "message": "Anime created successfully",
  "data": {
    "id": 6,
    "name": "New Anime",
    "created_at": "2026-04-20T12:00:00Z"
  }
}
```

---

## ✅ Conclusie

Het MVC pattern zorgt voor:
- 🎯 **Duidelijkheid** - Iedereen weet waar code hoort
- 🔄 **Onderhoudsbaarheid** - Changes zijn lokaal
- 🧪 **Testbaarheid** - Elke laag apart testbaar
- 📈 **Schaalvorming** - Project groeit gestructureerd
