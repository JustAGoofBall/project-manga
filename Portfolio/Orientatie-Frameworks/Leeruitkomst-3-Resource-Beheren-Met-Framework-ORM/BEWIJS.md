# 3️⃣ Leeruitkomst: Resource Beheren Met Framework & ORM (CRUD)

**Wat heb ik bereikt:**  
Ik ben in staat om middels een framework met ORM een resource te beheren (aanmaken, lijstweergave, detailweergave, aanpassen en verwijderen).

---

## 📋 Bewijsstuk 1: Resource Beheren - Anime CRUD

### ✅ Bewijs
- **Create** - Add new anime
- **Read** - List & detail views
- **Update** - Modify anime data
- **Delete** - Remove anime
- **All via framework & ORM** (Models + Express)

### 📝 Mijn Uitleg

**ORM = Object Relational Mapping**
- Converts database queries to JavaScript objects
- Makes data manipulation easier
- Reduces SQL code needed

**Anime Model (ORM Layer):**

```javascript
// models/animeModel.js - ORM for anime
class Anime {
  // CREATE
  static async create(name) {
    const query = 'INSERT INTO anime (name) VALUES (?)';
    const result = await db.query(query, [name]);
    return result.insertId;
  }

  // READ all
  static async getAll() {
    const query = 'SELECT * FROM anime';
    const [rows] = await db.query(query);
    return rows;
  }

  // READ one
  static async getById(id) {
    const query = 'SELECT * FROM anime WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  // UPDATE
  static async update(id, name) {
    const query = 'UPDATE anime SET name = ? WHERE id = ?';
    await db.query(query, [name, id]);
    return true;
  }

  // DELETE
  static async delete(id) {
    const query = 'DELETE FROM anime WHERE id = ?';
    const result = await db.query(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Anime;
```

**Express Routes using ORM:**

```javascript
// routes/anime.js - Framework routes using ORM
const router = express.Router();
const Anime = require('../models/animeModel');

// CREATE: POST /api/anime
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validation
    if (!name || name.trim().length < 1) {
      return res.status(400).json({ 
        message: 'Anime name required' 
      });
    }

    // Use ORM to create
    const id = await Anime.create(name.trim());
    
    res.status(201).json({
      success: true,
      data: { id, name }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ: GET /api/anime (list)
router.get('/', async (req, res) => {
  try {
    const anime = await Anime.getAll();
    res.json({
      success: true,
      count: anime.length,
      data: anime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ: GET /api/anime/:id (detail)
router.get('/:id', async (req, res) => {
  try {
    const anime = await Anime.getById(req.params.id);
    
    if (!anime) {
      return res.status(404).json({ 
        message: 'Anime not found' 
      });
    }

    res.json({
      success: true,
      data: anime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE: PUT /api/anime/:id
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length < 1) {
      return res.status(400).json({ 
        message: 'Name required' 
      });
    }

    const updated = await Anime.update(req.params.id, name.trim());
    
    if (!updated) {
      return res.status(404).json({ 
        message: 'Anime not found' 
      });
    }

    res.json({
      success: true,
      message: 'Anime updated'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: DELETE /api/anime/:id
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Anime.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        message: 'Anime not found' 
      });
    }

    res.json({
      success: true,
      message: 'Anime deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

---

## 📋 Bewijsstuk 2: Resource Beheren - Characters (Nested CRUD)

### ✅ Bewijs
- Characters behoren bij Anime
- Full CRUD for nested resource
- Cascading deletes
- ORM handles relationships

### 📝 Mijn Uitleg

**Nested Resource: Characters under Anime**

```javascript
// models/characterModel.js - ORM for characters
class Character {
  static async create(animeId, name) {
    const query = 'INSERT INTO characters (anime_id, name) VALUES (?, ?)';
    const result = await db.query(query, [animeId, name]);
    return result.insertId;
  }

  static async getByAnime(animeId) {
    const query = 'SELECT * FROM characters WHERE anime_id = ?';
    const [rows] = await db.query(query, [animeId]);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM characters WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  static async update(id, name) {
    const query = 'UPDATE characters SET name = ? WHERE id = ?';
    await db.query(query, [name, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM characters WHERE id = ?';
    const result = await db.query(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Character;
```

**Routes for Nested Characters:**

```javascript
// routes/characters.js
const router = express.Router({ mergeParams: true });
const Character = require('../models/characterModel');

// GET /api/anime/:animeId/characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.getByAnime(req.params.animeId);
    res.json({
      success: true,
      data: characters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/anime/:animeId/characters
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const id = await Character.create(req.params.animeId, name);
    res.status(201).json({ success: true, data: { id, name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Similar PUT and DELETE...
```

---

## 📋 Bewijsstuk 3: Frontend UI - Displaying Resources

### ✅ Bewijs
- React components for listing
- Detail view implemented
- Create/Update/Delete UI
- All connected to backend API via ORM

### 📝 Mijn Uitleg

**Frontend - Anime List Page (Read):**

```javascript
// pages/Home.jsx - List view
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from backend API (using ORM)
    fetch('/api/anime')
      .then(res => res.json())
      .then(data => {
        setAnime(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Anime List</h1>
      {anime.map(a => (
        <div key={a.id}>
          <strong>{a.name}</strong>
          <Link to={`/anime/${a.id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}
```

**Frontend - Anime Detail Page (Read specific):**

```javascript
// pages/AnimeDetail.jsx - Detail view
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    // Fetch specific anime from backend
    fetch(`/api/anime/${id}`)
      .then(res => res.json())
      .then(data => setAnime(data.data));
  }, [id]);

  if (!anime) return <div>Loading...</div>;

  return (
    <div>
      <h1>{anime.name}</h1>
      <p>Created: {anime.created_at}</p>
      {/* Other details */}
    </div>
  );
}
```

**Admin Panel - Create/Update/Delete:**

```javascript
// pages/AdminPanel.jsx - CRUD operations
export default function AdminPanel() {
  const [anime, setAnime] = useState('');

  const handleCreate = async () => {
    const response = await fetch('/api/anime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: anime })
    });
    
    if (response.ok) {
      setAnime('');
      // Refresh list
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/anime/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Refresh list
  };

  return (
    <div>
      <input 
        value={anime} 
        onChange={e => setAnime(e.target.value)}
        placeholder="New anime name"
      />
      <button onClick={handleCreate}>Add Anime</button>
      {/* Delete buttons for each anime */}
    </div>
  );
}
```

---

## 📋 Bewijsstuk 4: Resource Relaties

### ✅ Bewijs
- One-to-Many (Anime → Characters)
- User-to-Favorite relationship
- User-to-Rating relationship
- Foreign keys maintained

### 📝 Mijn Uitleg

**Database Schema (ORM Foundation):**

```sql
CREATE TABLE anime (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  anime_id INTEGER NOT NULL,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0
);

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  anime_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE(user_id, anime_id)
);
```

**ORM Methods for Relations:**

```javascript
// Get anime with all characters
static async getAnimeWithCharacters(animeId) {
  const anime = await Anime.getById(animeId);
  const characters = await Character.getByAnime(animeId);
  return { ...anime, characters };
}

// Get user favorites
static async getUserFavorites(userId) {
  const query = `
    SELECT anime.* FROM anime
    JOIN favorites ON anime.id = favorites.anime_id
    WHERE favorites.user_id = ?
  `;
  const [rows] = await db.query(query, [userId]);
  return rows;
}
```

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**CRUD Operations Bereikt:**
- ✅ **Create**: POST endpoints add new resources
- ✅ **Read**: GET endpoints fetch single/multiple
- ✅ **Update**: PUT endpoints modify resources
- ✅ **Delete**: DELETE endpoints remove resources

**ORM Benefits Ervaren:**
- Less SQL code to write
- Type safety with models
- Relationships handled cleanly
- Easy to test and maintain

**Wat Geleerd:**
- ORM abstracts database complexity
- Models keep logic organized
- Controllers use models (clean separation)
- ORM patterns are industry standard
