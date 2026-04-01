# 1️⃣ Leeruitkomst: API's Bouwen Op Basis van Endpoints

**Wat heb ik bereikt:**  
De student is in staat API's te bouwen op basis van endpoints.

---

## 📋 Bewijsstuk 1: Complete API Architectuur

### ✅ Bewijs
- Full REST API met 8 resource types
- MVC architectuur (Models → Controllers → Routes)
- Database relaties en queries
- Error handling & validatie

### 📝 Mijn Uitleg

**Gebouwde API Resources:**

1. **Anime Endpoints** (`/api/anime`)
   - GET /api/anime - All anime with characters
   - GET /api/anime/:id - Specific anime
   - POST /api/anime - Create (admin)
   - PUT /api/anime/:id - Update (admin)
   - DELETE /api/anime/:id - Delete (admin)

2. **Characters Endpoints** (`/api/anime/:animeId/characters`)
   - GET - List characters
   - GET /:characterId - Get specific
   - POST - Create character (admin)
   - PUT - Update character (admin)
   - DELETE - Delete character (admin)

3. **Authentication** (`/api/auth`)
   - POST /register - Create user
   - POST /login - Get JWT token
   - GET /me - Get profile (protected)
   - PUT /me - Update profile (protected)
   - DELETE /me - Delete account (protected)

4. **Ratings** (`/api/anime/:animeId/ratings`)
   - GET - List ratings
   - POST - Add rating (user)
   - PUT/:id - Update rating (user)
   - DELETE/:id - Delete rating (user)

5. **Favorites** (`/api/favorites`)
   - GET - My favorites (user)
   - POST/:animeId - Add favorite (user)
   - DELETE/:animeId - Remove favorite (user)

6. **Search** (`/api/search?q=query`)
   - GET - Search anime by name

7. **Admin** (`/api/admin`)
   - GET /users - List all users (admin)
   - PUT /users/:id/admin - Toggle admin (admin)
   - DELETE /users/:id - Delete user (admin)

**Total Endpoints:** 30+ werkende endpoints

### 🔗 Verwijzingen
- Route files: `/routes/anime.js`, `/routes/auth.js`, `/routes/ratings.js`, etc.
- Controllers: `/controllers/animeController.js`, `/controllers/authController.js`, etc.
- Models: `/models/animeModel.js`, `/models/userModel.js`, `/models/ratingModel.js`, etc.

---

## 📋 Bewijsstuk 2: Request/Response Cycle

### ✅ Bewijs
- Volledige flow van request tot response
- HTTP status codes
- JSON response format
- Error handling

### 📝 Mijn Uitleg

**Voorbeeld: GET /api/anime**

**Request:**
```http
GET http://localhost:3000/api/anime
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Naruto",
      "created_at": "2026-03-25T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "One Piece",
      "created_at": "2026-03-25T10:31:00.000Z"
    }
  ]
}
```

**Voorbeeld: POST /api/anime (Admin)**

**Request:**
```http
POST http://localhost:3000/api/anime
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Attack on Titan"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Anime created successfully",
  "data": {
    "id": 6,
    "name": "Attack on Titan",
    "created_at": "2026-03-25T14:45:00.000Z"
  }
}
```

**Voorbeeld: Error Response (404)**

```json
{
  "success": false,
  "message": "Anime not found"
}
```

### 🔍 Key Features:
- ✅ Consistent response format (`success`, `data`, `message`)
- ✅ Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- ✅ Descriptive error messages
- ✅ Authentication via JWT tokens
- ✅ Authorization checks (admin, user, public)

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**Wat heb ik geleerd?**
- APIs bouwen op basis van duidelijke endpoints
- Request/Response cycle begrijpen
- HTTP status codes correct toepassen
- Consistent response format = beter for developers

**Hoe heb ik dit bereikt?**
- Planning van endpoints VOOR implementatie
- MVC architectuur voor schone structuur
- Validatie en error handling op elke endpoint
- Testing om alles te verifiëren
