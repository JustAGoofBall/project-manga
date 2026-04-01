# 2️⃣ Leeruitkomst: Endpoints Voor Een API Opstellen

**Wat heb ik bereikt:**  
De student is in staat om endpoints voor een API op te stellen.

---

## 📋 Bewijsstuk 1: Endpoint Design & Planning

### ✅ Bewijs
- RESTful endpoint design
- HTTP methods (GET, POST, PUT, DELETE)
- URL structuur (hierarchisch)
- Resource-based naming

### 📝 Mijn Uitleg

**RESTful Design Principes Toegepast:**

**1. Resource-Based URLs**
```
✅ GOED:
GET    /api/anime                    # Get collection
GET    /api/anime/1                  # Get specific resource
POST   /api/anime                    # Create new resource
PUT    /api/anime/1                  # Update resource
DELETE /api/anime/1                  # Delete resource

❌ SLECHT (Action-based):
GET    /api/getAnime
POST   /api/createAnime
PUT    /api/updateAnime/1
DELETE /api/deleteAnime/1
```

**2. HTTP Methods (Semantiek)**
```
GET    = Read data (safe, idempotent)
POST   = Create new resource
PUT    = Update entire resource
DELETE = Remove resource
```

**3. Hierarchische URLs (Nested Resources)**
```
/api/anime                              # All anime
/api/anime/1                            # Specific anime
/api/anime/1/characters                 # Characters van anime 1
/api/anime/1/characters/5               # Specifieke character
/api/anime/1/ratings                    # Ratings voor anime 1
/api/anime/1/ratings/10                 # Specifieke rating
```

**4. Query Parameters (Filtering)**
```
GET /api/search?q=naruto               # Search query
GET /api/anime?sort=name               # Sorting (optioneel)
GET /api/anime?limit=10&offset=0       # Pagination (optioneel)
```

---

## 📋 Bewijsstuk 2: Endpoint Implementatie

### ✅ Bewijs
- Route definitie
- Controller logica
- Validatie
- Error handling

### 📝 Mijn Uitleg

**Voorbeeld 1: GET /api/anime (List)**

**Route definition** (`routes/anime.js`):
```javascript
router.get('/', animeController.getAllAnime);
```

**Controller** (`controllers/animeController.js`):
```javascript
exports.getAllAnime = async (req, res) => {
  try {
    const anime = await Anime.getAll();
    
    res.json({
      success: true,
      count: anime.length,
      data: anime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};
```

**Key Features:**
- ✅ Async/await for database
- ✅ Error handling
- ✅ Consistent response format
- ✅ Proper HTTP status codes

**Voorbeeld 2: POST /api/anime (Create - Protected)**

**Route definition**:
```javascript
router.post('/', authMiddleware, adminMiddleware, animeController.createAnime);
```

**Controller**:
```javascript
exports.createAnime = async (req, res, next) => {
  try {
    // Validate input
    const validationError = validateAnimeName(req.body.name);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // Create anime
    const animeId = await Anime.create(req.body.name.trim());

    res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: { id: animeId, name: req.body.name }
    });
  } catch (error) {
    next(error);
  }
};
```

**Key Features:**
- ✅ Authentication middleware
- ✅ Authorization (admin only)
- ✅ Input validation
- ✅ 201 Created status
- ✅ Error handling via next()

**Voorbeeld 3: DELETE /api/anime/:id (Delete - Protected)**

```javascript
exports.deleteAnime = async (req, res, next) => {
  try {
    const id = validateAnimeId(req.params.id);
    
    const deleted = await Anime.delete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    res.json({
      success: true,
      message: 'Anime deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 📋 Bewijsstuk 3: Volledige Endpoint Overview

### ✅ Bewijs
- Alle endpoints gedocumenteerd
- Request/response examples
- Status codes per endpoint

### 📝 Mijn Uitleg

**Volledige Endpoint Structuur:**

| Method | Endpoint | Auth | Admin | Purpose |
|--------|----------|------|-------|---------|
| GET | /api/anime | ❌ | ❌ | Alle anime ophalen |
| GET | /api/anime/:id | ❌ | ❌ | Specifieke anime |
| POST | /api/anime | ✅ | ✅ | Anime toevoegen |
| PUT | /api/anime/:id | ✅ | ✅ | Anime updaten |
| DELETE | /api/anime/:id | ✅ | ✅ | Anime verwijderen |
| | | | | |
| GET | /api/anime/:id/characters | ❌ | ❌ | Characters ophalen |
| POST | /api/anime/:id/characters | ✅ | ✅ | Character toevoegen |
| | | | | |
| POST | /api/auth/register | ❌ | ❌ | Account maken |
| POST | /api/auth/login | ❌ | ❌ | Inloggen |
| GET | /api/auth/me | ✅ | ❌ | Mijn profiel |
| | | | | |
| GET | /api/favorites | ✅ | ❌ | Mijn favorieten |
| POST | /api/favorites/:id | ✅ | ❌ | Favoriet toevoegen |
| DELETE | /api/favorites/:id | ✅ | ❌ | Favoriet verwijderen |

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**Wat heb ik geleerd?**
- RESTful API design principes
- Endpoints logisch opbouwen
- HTTP methods correct toepassen
- Beveiliging op endpoints (auth/admin)
- Consistente response formaten

**Voordelen van deze aanpak:**
- Developers weten hoe API werkt
- Endpoints zijn voorspelbaar
- Makkelijk uit te breiden
- Industry standard
