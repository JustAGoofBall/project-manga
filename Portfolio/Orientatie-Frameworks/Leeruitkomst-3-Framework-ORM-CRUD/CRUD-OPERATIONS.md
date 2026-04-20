# 🔧 CRUD Operations Showcase

## CREATE - Nieuwe Records

### Model Level
```javascript
// models/animeModel.js
static async create(name) {
  const query = 'INSERT INTO anime (name) VALUES (?)';
  const [result] = await db.query(query, [name]);
  return { id: result.insertId, name };
}
```

### Controller Level  
```javascript
// controllers/animeController.js
exports.createAnime = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Anime name required'
      });
    }
    
    // Create
    const anime = await Anime.create(name);
    
    res.status(201).json({
      success: true,
      message: 'Anime created',
      data: anime
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
```

### Route Level
```javascript
// routes/anime.js
router.post('/api/anime', authMiddleware, createAnime);
```

### Usage
```bash
POST /api/anime
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Steins;Gate"
}

RESPONSE (201):
{
  "success": true,
  "data": { "id": 6, "name": "Steins;Gate" }
}
```

---

## READ - Data Ophalen

### List (Read All)
```javascript
// Model
static async getAll() {
  const [anime] = await db.query('SELECT * FROM anime');
  return anime;
}

// Controller
exports.getAllAnime = async (req, res) => {
  try {
    const anime = await Anime.getAll();
    res.json({
      success: true,
      data: anime,
      count: anime.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Route
router.get('/api/anime', getAllAnime);

// Usage
GET /api/anime
Response: { "success": true, "data": [...], "count": 5 }
```

### Detail (Read Single)
```javascript
// Model
static async getById(id) {
  const [anime] = await db.query(
    'SELECT * FROM anime WHERE id = ?',
    [id]
  );
  return anime.length > 0 ? anime[0] : null;
}

// Controller
exports.getAnimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const anime = await Anime.getById(id);
    
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    res.json({ success: true, data: anime });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Usage
GET /api/anime/1
Response: { "success": true, "data": { "id": 1, "name": "Naruto" } }
```

---

## UPDATE - Records Aanpassen

```javascript
// Model
static async update(id, name) {
  const query = 'UPDATE anime SET name = ? WHERE id = ?';
  await db.query(query, [name, id]);
  return await this.getById(id);
}

// Controller
exports.updateAnime = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name required for update'
      });
    }
    
    const anime = await Anime.update(id, name);
    
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Anime updated',
      data: anime
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Usage
PUT /api/anime/1
{
  "name": "Naruto: New Name"
}
Response: { "success": true, "data": { "id": 1, "name": "Naruto: New Name" } }
```

---

## DELETE - Records Verwijderen

```javascript
// Model
static async delete(id) {
  const query = 'DELETE FROM anime WHERE id = ?';
  const [result] = await db.query(query, [id]);
  return result.affectedRows > 0;
}

// Controller
exports.deleteAnime = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Anime.delete(id);
    
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Usage
DELETE /api/anime/1
Response: { "success": true, "message": "Anime deleted" }
```

---

## 📚 Alle Resources Met CRUD

| Resource | Model | Create | Read | Update | Delete |
|---|---|---|---|---|---|
| **Anime** | animeModel.js | ✅ | ✅ | ✅ | ✅ |
| **Characters** | characterModel.js | ✅ | ✅ | ✅ | ✅ |
| **Users** | userModel.js | ✅ | ✅ | ✅ | ✅ |
| **Ratings** | ratingModel.js | ✅ | ✅ | ✅ | ✅ |
| **Favorites** | favoriteModel.js | ✅ | ✅ | ❌ | ✅ |

---

## 🎯 ORM Pattern Toegepast

Hoewel MySQL2 geen traditionele ORM is (geen Sequelize/TypeORM), pas ik wel ORM-patterns toe:

```javascript
// ✅ Pattern 1: Class-based data access
class Anime {
  static async getAll() { ... }
  static async getById(id) { ... }
  static async create(name) { ... }
  static async update(id, name) { ... }
  static async delete(id) { ... }
}

// ✅ Pattern 2: Model encapsulation
const anime = await Anime.getById(1);
// Access object properties like ORM would
anime.name, anime.id, anime.created_at

// ✅ Pattern 3: Query abstraction
// Models hide SQL details from controllers
// Controllers only call model methods
```

---

## 💾 Connection Management

```javascript
// config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

// Usage in models - connection handled automatically
const [results] = await db.query('SELECT * FROM anime');
```

---

## ✅ Conclusie

Alle CRUD operaties zijn:
- ✅ Geïmplementeerd per resource
- ✅ via ORM-achtige pattern
- ✅ met error handling
- ✅ met validation
- ✅ werkend in production
