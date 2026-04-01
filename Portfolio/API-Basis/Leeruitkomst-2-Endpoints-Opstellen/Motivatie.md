# Leeruitkomst 2: Endpoints Voor Een API Opstellen

## Motivatie

Ik kan endpoints voor een API opstellen volgens RESTful design principes. Dit vereist begrip van HTTP methods, resource-based URLs, en professionele API design patterns.

### RESTful Design Principes

**Principe 1: Resource-Based URLs**

❌ Slecht (Action-Based):
```
/api/getAnime
/api/createAnime
/api/updateAnime/1
/api/deleteAnime/1
```

✅ Goed (Resource-Based):
```
GET    /api/anime       # Get all
POST   /api/anime       # Create
GET    /api/anime/1     # Get one
PUT    /api/anime/1     # Update
DELETE /api/anime/1     # Delete
```

**Waarom?** Resource URLs zijn standaard, flexibel, en semantisch duidelijk.

### HTTP Methods (Semantiek)

| Method | Semantiek | Voorbeeld |
|--------|-----------|-----------|
| GET | Read (veilig, idempotent) | `GET /api/anime` |
| POST | Create (new resource) | `POST /api/anime` → 201 Created |
| PUT | Update (hele resource) | `PUT /api/anime/1` |
| DELETE | Delete | `DELETE /api/anime/1` |

**Regel:** Juiste method gebruiken = zelf-documenterend, herkenbaarheid.

### Hierarchische Structuur

```
/api/anime                    # Resource top-level
/api/anime/1                  # Specific resource
/api/anime/1/characters       # Sub-resource
/api/anime/1/characters/5     # Specific sub-resource
/api/anime/1/ratings          # Sub-resource
/api/anime/1/ratings/10       # Specific rating
```

**Voordeel:** Relaties duidelijk gemaakt via URL structuur.

### Query Parameters voor Filtering

```
GET /api/search?q=naruto              # Search
GET /api/anime?sort=name              # Sorting
GET /api/anime?limit=10&offset=0      # Pagination
```

**Regel:** Query parameters voor filtering/pagination, niet in de URL path.

### Endpoint Planning & Documentatie

Alvorens te coderen:

**1. Resource Identificatie**
```
- Anime (met GET, POST, PUT, DELETE endpoints)
- Characters (sub-resource van anime)
- Users (met authentication)
- Ratings (sub-resource van anime)
- Favorites (user's favorites)
```

**2. Endpoint List**
```
Anime:
  GET    /api/anime              # List all
  POST   /api/anime              # Create (admin)
  GET    /api/anime/:id          # Get one
  PUT    /api/anime/:id          # Update (admin)
  DELETE /api/anime/:id          # Delete (admin)

Characters:
  GET    /api/anime/:id/characters        # List
  POST   /api/anime/:id/characters        # Create
  PUT    /api/anime/:id/characters/:cid   # Update
  DELETE /api/anime/:id/characters/:cid   # Delete
```

**3. Method Bepalen**
```
✅ POST = Create data (return 201)
✅ GET = Read data (idempotent)
✅ PUT = Update data
✅ DELETE = Remove data
```

**4. Authentication/Authorization**
```
/:id/characters                    # Public read
POST /:id/characters               # Admin only
PUT /:id/characters/:cid           # Admin only
DELETE /:id/characters/:cid        # Admin only
```

### Controller Implementatie

Elke endpoint:

```javascript
exports.createAnime = async (req, res, next) => {
  try {
    // 1. Validate input
    const validationError = validateAnimeName(req.body.name);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        message: validationError 
      });
    }

    // 2. Check authorization
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    // 3. Create in database
    const animeId = await Anime.create(req.body.name);

    // 4. Return success
    res.status(201).json({
      success: true,
      message: 'Anime created',
      data: { id: animeId, name: req.body.name }
    });
  } catch (error) {
    next(error); // Error handler middleware
  }
};
```

### Response Format Consistency

Alle endpoints dezelfde structuur:
```json
{
  "success": true/false,
  "message": "descriptive message",
  "data": {},
  "count": 0,
  "error": "technical error (debug only)"
}
```

### Bewijslast

Zie bewijslast (1), (2), (3), (4)
