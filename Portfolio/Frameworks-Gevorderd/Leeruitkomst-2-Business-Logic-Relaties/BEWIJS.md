# 2️⃣ Leeruitkomst: Business Logic & Relaties

**Wat heb ik bereikt:**  
Ik kan business logic en relaties binnen de model laag van mijn applicatie toepassen.

---

## 📋 Bewijsstuk 1: Database Schema & Relaties

### ✅ Bewijs
- Database schema met alle relaties
- Voorbeeld van JOIN queries
- Foreign key constraints screenshot

### 💬 Feedback Verwacht Van
- Docent Timo

### 📝 Mijn Uitleg

**Database Relaties:**

```
users (1) ──────── (N) anime_ratings (N) ──────── (1) anime
                             │
                        Relatie: user_id, anime_id
                        Unique: per user 1 rating per anime
                        

users (1) ──────── (N) favorites (N) ──────── (1) anime
                             │
                        Relatie: user_id, anime_id
                        Unique: per user 1x favoriet per anime


anime (1) ──────── (N) characters
                    │
               Relatie: anime_id
               Cascade: als anime delete → characters delete
```

**Key Features:**
- ✅ Foreign keys voor referentiële integriteit
- ✅ Unique constraints om duplicaten te voorkomen
- ✅ Cascade delete voor automatische cleanup
- ✅ Timestamps voor audit trail

### 🔗 Referenties
- Schema file: `/schema.sql`
- Voorbeeld queries in `/models`

---

## 📋 Bewijsstuk 2: Model Layer Implementation

### ✅ Bewijs
- Code voorbeelden van models met relaties
- Voorbeeld van SELECT met JOIN
- Demonstratie van complex queries

### 💬 Feedback Verwacht Van
- Docent Timo
- Medestudent Samir

### 📝 Mijn Uitleg

**Voorbeeld 1: getAnimeWithCharacters**
```javascript
// models/animeModel.js
static async getAnimeWithCharacters(id) {
  const [anime] = await db.query(
    `SELECT a.id, a.name, a.created_at,
            c.id as char_id, c.name as char_name
     FROM anime a
     LEFT JOIN characters c ON a.id = c.anime_id
     WHERE a.id = ?`,
    [id]
  );
  
  // Restructure data
  return {
    id: anime[0].id,
    name: anime[0].name,
    created_at: anime[0].created_at,
    characters: anime.map(row => ({
      id: row.char_id,
      name: row.char_name
    }))
  };
}
```

**Business Logic:**
- ✅ LEFT JOIN haalt anime met characters
- ✅ Data restructuring voor proper JSON format
- ✅ Efficient querying (1 query ipv N queries)

**Voorbeeld 2: getRatingsWithUserInfo**
```javascript
// models/ratingModel.js
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

**Business Logic:**
- ✅ INNER JOIN for ratings with user info
- ✅ ORDER BY voor chronologische volgorde
- ✅ Zuiver model - geen http/express code

### 🔗 Referenties
- Models: `/models/*.js`
- Controllers gebruiken models: `/controllers/*.js`

---

## 📋 Bewijsstuk 3: Praktische Demonstratie

### ✅ Bewijs
- Screenshot van werking (ratings toevoegen/ophalen)
- Browser console met API response
- Database query output

### 💬 Feedback Verwacht Van
- Medestudent Samir

### 📝 Mijn Uitleg

**USE CASE: User geeft rating voor anime**

1. Frontend: POST /api/anime/1/ratings
2. Controller: validateRating()
3. Model: Rating.create(user_id, anime_id, rating, review)
4. Database: INSERT INTO ratings VALUES (...)
5. Response: { success: true, rating: {...} }

**Relaties in actie:**
- ✅ User exists (checked via FK)
- ✅ Anime exists (checked via FK)
- ✅ Only 1 rating per user per anime (UNIQUE constraint)
- ✅ ON DELETE CASCADE: als user delete → ratings delete

---

## 🎯 Feedback Ontvangen

### Van Timo:
[Nog in te vullen na feedback ontvangen]

### Van Samir:
[Nog in te vullen na feedback ontvangen]

---

## 🎯 Checklist Leeruitkomst 2

- [ ] Database schema screenshot
- [ ] Model code voorbeelden
- [ ] Query examples
- [ ] Feedback van Timo ontvangen
- [ ] Feedback van Samir ontvangen
- [ ] Use case beschreven

**Status:** ⏳ In Progress

---

## 💡 Reflectie

Wat heb ik geleerd?
- Relaties in database voorkomen data redundantie
- Joins zijn efficiënter dan N+1 queries
- Business logic in model laag = herbruikbaar

Hoe kan ik dit verbeteren?
- [Vul in na feedback]
