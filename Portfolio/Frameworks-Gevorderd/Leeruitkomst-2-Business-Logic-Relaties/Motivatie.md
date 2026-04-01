# Leeruitkomst 2: Business Logic & Relaties

## Motivatie

Ik ben in staat business logic en relaties binnen de model laag van mijn applicatie correct toe te passen. Dit vereist DatabaseSQL kennis, relational design, en query optimization.

### Database Relaties

**Relatie 1: Users → Ratings**
```
users (1) ──────── (N) ratings
         (one user has many ratings)
         
- Constraint: UNIQUE(user_id, anime_id)
- Only 1 rating per user per anime
- ON DELETE CASCADE: delete user → delete ratings
```

**Relatie 2: Users → Favorites**
```
users (1) ──────── (N) favorites
         (one user has many favorites)
         
- Constraint: UNIQUE(user_id, anime_id)
- Only 1x per user per anime
```

**Relatie 3: Anime ↔ Characters**
```
anime (1) ──────── (N) characters
        (one anime has many characters)
        
- Foreign key: anime_id
- ON DELETE CASCADE: delete anime → delete characters
```

**Relatie 4: Anime ↔ Ratings**
```
anime (1) ──────── (N) ratings
       (one anime has many ratings)
       
- Foreign key: anime_id
```

### Business Logic in Models

**Voorbeeld 1: getAnimeWithCharacters()**

```javascript
static async getAnimeWithCharacters(id) {
  const [anime] = await db.query(
    `SELECT a.id, a.name, a.created_at,
            c.id as char_id, c.name as char_name
     FROM anime a
     LEFT JOIN characters c ON a.id = c.anime_id
     WHERE a.id = ?`,
    [id]
  );
  
  // Restructure into proper format
  return {
    id: anime[0].id,
    name: anime[0].name,
    characters: anime.map(row => ({
      id: row.char_id,
      name: row.char_name
    }))
  };
}
```

**Logic:**
- ✅ LEFT JOIN to include anime without characters
- ✅ Data restructuring for proper JSON format
- ✅ Single query (efficient!)

**Voorbeeld 2: getRatingsForAnime()**

```javascript
static async getRatingsForAnime(animeId) {
  const [ratings] = await db.query(
    `SELECT r.id, r.rating, r.review, r.created_at,
            u.username, u.id as user_id
     FROM ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.anime_id = ?
     ORDER BY r.created_at DESC`,
    [animeId]
  );
  
  return ratings;
}
```

**Logic:**
- ✅ INNER JOIN for ratings + user info
- ✅ ORDER BY for chronological order
- ✅ Only show published ratings

**Voorbeeld 3: Prevent Duplicate Rating**

```javascript
static async create(userId, animeId, rating) {
  // Check if rating already exists
  const [existing] = await db.query(
    'SELECT id FROM ratings WHERE user_id = ? AND anime_id = ?',
    [userId, animeId]
  );
  
  if (existing.length > 0) {
    throw new Error('You already rated this anime');
  }
  
  // UNIQUE constraint also prevents this, but app-level check better UX
  const [result] = await db.query(
    'INSERT INTO ratings (user_id, anime_id, rating) VALUES (?, ?, ?)',
    [userId, animeId, rating]
  );
  
  return result.insertId;
}
```

**Logic:**
- ✅ App-level validation for better UX
- ✅ Database constraint as safety net
- ✅ Transactions for data integrity

### Query Optimization

**N+1 Query Problem (Avoid):**
```javascript
// ❌ BAD: 1 query for anime, 1 query per character = N queries!
const anime = await getAnime(id);
const characters = [];
for (let char of anime.characterIds) {
  characters.push(await getCharacter(char));
}
```

**Joined Query (Good):**
```javascript
// ✅ GOOD: 1 query gets everything!
const result = await db.query(
  `SELECT a.*, c.* FROM anime a
   LEFT JOIN characters c ON a.id = c.anime_id
   WHERE a.id = ?`,
  [id]
);
```

### Transactions for Data Integrity

```javascript
async create(animeData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Insert anime
    const [animeResult] = await connection.query(
      'INSERT INTO anime (name) VALUES (?)',
      [animeData.name]
    );
    const animeId = animeResult.insertId;
    
    // Insert characters  
    for (let char of animeData.characters) {
      await connection.query(
        'INSERT INTO characters (anime_id, name) VALUES (?, ?)',
        [animeId, char.name]
      );
    }
    
    await connection.commit();
    return animeId;
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

**Logic:**
- ✅ All-or-nothing: if any fails, all rollback
- ✅ Data consistency maintained
- ✅ No partial data in database

### Bewijslast

Zie bewijslast (1), (2), (3), (4)
