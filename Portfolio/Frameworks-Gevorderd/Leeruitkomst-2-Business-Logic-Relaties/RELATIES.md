# 🔗 Database Relationships & Business Logic

## Database Schema Overview

### 📊 Relatie Diagram

```
┌──────────────┐         ┌────────────────┐
│    users     │         │      anime     │
├──────────────┤         ├────────────────┤
│ id (PK)      │         │ id (PK)        │
│ username     │         │ name           │
│ email        │         │ created_at     │
│ password_hash│         └────────────────┘
└──────────────┘                ▲
       │                        │
       │ 1─────────────M        │ 1
       │                        │
       │            ┌───────────┴────────────┐
       │            │                        │
       ▼            ▼                        ▼
┌────────────────┐─────────────┐  ┌─────────────────┐
│    ratings     │  characters │  │    favorites    │
├────────────────┤─────────────┤  ├─────────────────┤
│ id (PK)        │ id (PK)     │  │ id (PK)         │
│ user_id (FK)   │ anime_id(FK)│  │ user_id (FK)    │
│ anime_id(FK)   │ name        │  │ anime_id (FK)   │
│ rating         └─────────────┘  └─────────────────┘
│ review         (1-to-many)         (many-to-many)
└────────────────┘ 
   (many-to-many
     junction)
```

---

## 1️⃣ One-to-Many: Anime → Characters

### Schema Definition
```sql
CREATE TABLE characters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  anime_id INT NOT NULL,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
);
```

**Relationship:** 1 anime kan many characters hebben

### Model Implementation

```javascript
// models/animeModel.js

class Anime {
  /**
   * Get anime with all its characters
   */
  static async getAll() {
    const [anime] = await db.query('SELECT * FROM anime');
    
    // Fetch characters for each anime
    const animeWithCharacters = await Promise.all(
      anime.map(async (a) => {
        const [characters] = await db.query(
          'SELECT id, name FROM characters WHERE anime_id = ?',
          [a.id]
        );
        return { ...a, characters };
      })
    );
    
    return animeWithCharacters;
  }

  static async getById(id) {
    const [anime] = await db.query('SELECT * FROM anime WHERE id = ?', [id]);
    
    if (anime.length === 0) return null;
    
    // Fetch characters for this anime
    const [characters] = await db.query(
      'SELECT id, name FROM characters WHERE anime_id = ?',
      [id]
    );
    
    return {
      ...anime[0],
      characters
    };
  }
}
```

### Usage in Controller

```javascript
// controllers/animeController.js

exports.getAnimeById = async (req, res) => {
  const anime = await Anime.getById(req.params.id);
  // anime already includes characters (fetched in model!)
  res.json({ success: true, data: anime });
};

// Response:
// {
//   "success": true,
//   "data": {
//     "id": 1,
//     "name": "Naruto",
//     "characters": [
//       { "id": 1, "name": "Naruto Uzumaki" },
//       { "id": 2, "name": "Sasuke Uchiha" },
//       ...
//     ]
//   }
// }
```

**Key Point:** Model encapsulates the relationship. Controllers don't need to know about the join logic.

---

## 2️⃣ Many-to-Many: Users ↔ Favorites (via Junction Table)

### Schema Definition
```sql
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_favorite (user_id, anime_id)
);
```

**Relationship:** 1 user can have many favorites, 1 anime can be favorite of many users

### Model Implementation

```javascript
// models/favoriteModel.js

class Favorite {
  /**
   * Get all favorites for a user
   */
  static async getUserFavorites(userId) {
    const [results] = await db.query(
      `SELECT 
        f.id,
        f.anime_id,
        a.name as anime_name,
        f.created_at
       FROM favorites f
       JOIN anime a ON f.anime_id = a.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
    
    return results;
  }

  /**
   * Add anime to user's favorites
   */
  static async addFavorite(userId, animeId) {
    try {
      const [result] = await db.query(
        'INSERT INTO favorites (user_id, anime_id) VALUES (?, ?)',
        [userId, animeId]
      );
      
      return { id: result.insertId, user_id: userId, anime_id: animeId };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error('Already in favorites');
      }
      throw err;
    }
  }

  /**
   * Remove anime from favorites
   */
  static async removeFavorite(userId, favoriteId) {
    const [result] = await db.query(
      'DELETE FROM favorites WHERE id = ? AND user_id = ?',
      [favoriteId, userId]
    );
    
    return result.affectedRows > 0;
  }
}
```

### Usage in Controller

```javascript
// controllers/favoriteController.js

exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;  // From JWT middleware
    const favorites = await Favorite.getUserFavorites(userId);
    
    res.json({
      success: true,
      data: favorites,
      count: favorites.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { anime_id } = req.body;
    
    // Model handles duplicate check (UNIQUE constraint)
    const favorite = await Favorite.addFavorite(userId, anime_id);
    
    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
```

---

## 3️⃣ Many-to-Many with Extra Data: Users ↔ Ratings ↔ Anime

### Schema Definition
```sql
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 10),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_anime (user_id, anime_id)
);
```

**Relationship:** Users rate Anime, with extra fields (rating, review)

### Query with JOIN

```javascript
// models/ratingModel.js

static async getRatingsForAnime(animeId) {
  const [results] = await db.query(
    `SELECT 
      r.id,
      r.rating,
      r.review,
      r.created_at,
      u.username,
      u.id as user_id
     FROM ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.anime_id = ?
     ORDER BY r.created_at DESC`,
    [animeId]
  );
  
  return {
    average_rating: results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.rating, 0) / results.length * 10) / 10
      : 0,
    total_ratings: results.length,
    ratings: results
  };
}
```

### Response Example
```json
{
  "anime_id": 1,
  "average_rating": 8.5,
  "total_ratings": 4,
  "ratings": [
    {
      "id": 1,
      "rating": 9,
      "review": "Amazing!",
      "username": "user1",
      "created_at": "2026-04-20T10:00:00Z"
    },
    ...
  ]
}
```

---

## 🎯 Business Logic Encapsulation

### ✅ Good: Logic in Model

```javascript
// Model knows how to fetch related data
const anime = await Anime.getById(1);
// anime automatically includes characters

const favorites = await Favorite.getUserFavorites(userId);
// Already JOINed with anime names
```

### ❌ Bad: Logic in Controller

```javascript
// Controller does JOINs (messy!)
const anime = await db.query('SELECT * FROM anime WHERE id = ?', [id]);
const characters = await db.query('SELECT * FROM characters WHERE anime_id = ?', [id]);
// Manual joining, repeated in multiple controllers
```

---

## 🔍 Efficient Query Patterns

### Pattern 1: Avoid N+1 Queries

```javascript
// ❌ Bad: N+1 problem (1 query for anime + N queries for characters)
const anime = await db.query('SELECT * FROM anime');
const animeWithChars = anime.map(async a => {
  const chars = await db.query('SELECT * FROM characters WHERE anime_id = ?', [a.id]);
  return { ...a, characters: chars };
});
// Total: 1 + N queries!

// ✅ Good: Single JOIN query
const result = await db.query(`
  SELECT a.*, c.* FROM anime a
  LEFT JOIN characters c ON a.id = c.anime_id
`);
```

### Pattern 2: Parameterized Queries (SQL Injection Prevention)

```javascript
// ✅ Safe - Parameters prevent SQL injection
const [results] = await db.query(
  'SELECT * FROM favorites WHERE user_id = ?',
  [userId]  // Value is parameterized
);

// ❌ Unsafe - Vulnerable to SQL injection
const query = `SELECT * FROM favorites WHERE user_id = ${userId}`;
```

---

## 📊 Relationships Summary

| Relationship | Type | Table 1 | Table 2 | Junction? |
|---|---|---|---|---|
| Anime → Characters | 1-to-M | anime | characters | No |
| User → Ratings | M-to-M | users | anime | ratings (extra data!) |
| User → Favorites | M-to-M | users | anime | favorites (no extra data) |

---

## ✅ Conclusion

**Demonstrated:**
- ✅ Correct schema design with Foreign Keys
- ✅ Model layer handles all relationship logic
- ✅ Controllers stay simple, don't know about joins
- ✅ Efficient queries without N+1 problems
- ✅ SQL injection prevention with parameterization
- ✅ Real-world relationship patterns (1-M, M-M, M-M with extra data)

This is **professional-level database design**! 🎯
