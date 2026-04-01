# Leeruitkomst 1: API's Bouwen Op Basis van Endpoints

## Motivatie

Ik ben in staat API's te bouwen op basis van duidelijk gedefinieerde endpoints. Dit vereist inzicht in architectuur, request/response cycles, en professionele API design.

### Wat Is Een API?

API = Application Programming Interface
- Manier voor programma's om met elkaar te communiceren
- REST API = meest gebruikte type
- Over HTTP met duidelijke endpoints

### APIs Bouwen Bij Project Manga

**30+ Werkende Endpoints** gebouwd met:
- Models (database layer)
- Controllers (business logic)
- Routes (URL mapping)
- Middleware (authentication, errors)

### Endpoint Categorieën

**1. Anime Endpoints** (5 endpoints)
```
GET  /api/anime        → All anime
GET  /api/anime/:id    → Specific anime
POST /api/anime        → Create (admin)
PUT  /api/anime/:id    → Update (admin)
DELETE /api/anime/:id  → Delete (admin)
```

**2. Characters Endpoints** (5 endpoints)
```
GET  /api/anime/:id/characters
POST /api/anime/:id/characters
PUT  /api/anime/:id/characters/:charId
DELETE /api/anime/:id/characters/:charId
```

**3. Authentication Endpoints** (5 endpoints)
```
POST /api/auth/register  → Create user
POST /api/auth/login     → Get JWT token
GET  /api/auth/me        → Profile (protected)
PUT  /api/auth/me        → Update (protected)
DELETE /api/auth/me      → Delete account (protected)
```

**4. Ratings Endpoints** (4 endpoints)
```
GET  /api/anime/:id/ratings
POST /api/anime/:id/ratings
PUT  /api/anime/:id/ratings/:ratingId
DELETE /api/anime/:id/ratings/:ratingId
```

**5. Favorites Endpoints** (3 endpoints)
```
GET  /api/favorites
POST /api/favorites/:animeId
DELETE /api/favorites/:animeId
```

**6. Admin Endpoints** (3 endpoints)
```
GET  /api/admin/users
PUT  /api/admin/users/:id/admin
DELETE /api/admin/users/:id
```

**7. Search Endpoint** (1 endpoint)
```
GET /api/search?q=naruto
```

### Request/Response Cycle

**Voorbeeld: GET /api/anime**

Cliente stuurt:
```
GET /api/anime
```

Server antwoordt:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {"id": 1, "name": "Naruto"},
    {"id": 2, "name": "One Piece"}
  ]
}
```

**Status Codes Correct Gebruikt:**
- 200 OK = Succes (GET, PUT)
- 201 Created = Resource aangemaakt (POST)
- 400 Bad Request = Ongeldige input
- 401 Unauthorized = Geen authentificatie
- 403 Forbidden = Geen autorisatie
- 404 Not Found = Resource bestaat niet
- 500 Internal Server Error = Server fout

### Architectuur Voor APIs

Elk endpoint volgt MVC:
1. **Route** → Ontsluit URL
2. **Controller** → Doe business logica
3. **Model** → Lees/schrijf database

Dit maakt APIs:
- ✅ Testbaar (elke laag apart)
- ✅ Onderhoudbaar (weet waar kijken)
- ✅ Schaalbaar (makkelijk uitbreiden)
- ✅ Beveiligd (middleware checks)

### Error Handling

Alle endpoints hebben error handling:
```json
{
  "success": false,
  "message": "Descriptive error",
  "error": "technical details"
}
```

### Bewijslast

Zie bewijslast (1), (2), (3), (4)
