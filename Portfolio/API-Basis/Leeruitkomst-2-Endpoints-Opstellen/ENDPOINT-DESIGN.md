# 📐 Endpoint Design Breakdown

## Request/Response Patterns Per Type

### Voorbeeld 1: GET Endpoint (List)
```json
REQUEST:
GET /api/anime
Authorization: Bearer {jwt_token}

RESPONSE (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Naruto",
      "created_at": "2026-01-15T10:30:00Z"
    },
    ...
  ],
  "count": 5
}
```

**Code Locatie:** [controllers/animeController.js - getAllAnime()](../../../controllers/animeController.js)

---

### Voorbeeld 2: POST Endpoint (Create)
```json
REQUEST:
POST /api/anime
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Anime Title"
}

RESPONSE (201 Created):
{
  "success": true,
  "message": "Anime created successfully",
  "data": {
    "id": 6,
    "name": "New Anime Title",
    "created_at": "2026-04-20T12:00:00Z"
  }
}
```

**Code Locatie:** [controllers/animeController.js - createAnime()](../../../controllers/animeController.js)
**Validatie:** [validators/animeValidator.js](../../../validators/animeValidator.js)

---

### Voorbeeld 3: PUT Endpoint (Update)
```json
REQUEST:
PUT /api/ratings/:id
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "rating": 8,
  "review": "Zeer aanrader!"
}

RESPONSE (200 OK):
{
  "success": true,
  "message": "Rating updated successfully",
  "data": {
    "id": 1,
    "rating": 8,
    "review": "Zeer aanrader!",
    "updated_at": "2026-04-20T14:30:00Z"
  }
}
```

---

### Voorbeeld 4: DELETE Endpoint
```json
REQUEST:
DELETE /api/favorites/1
Authorization: Bearer {jwt_token}

RESPONSE (200 OK):
{
  "success": true,
  "message": "Favorite removed successfully"
}

RESPONSE (404 Not Found):
{
  "success": false,
  "message": "Favorite not found"
}
```

---

## 🎯 Design Principes Toegepast

### 1️⃣ **Consistent Response Format**
Alle responses volgen dezelfde structuur:
```json
{
  "success": boolean,
  "message": string (optional),
  "data": object|array (optional),
  "errors": array (optional)
}
```

**Bewijs:** [middleware/errorHandler.js](../../../middleware/errorHandler.js) - Centralized response formatting

### 2️⃣ **Status Codes**
- **200** POST success
- **201** Created new resource
- **400** Validation error (invalid input)
- **401** Unauthorized (missing/invalid JWT)
- **403** Forbidden (user doesn't have permission)
- **404** Resource not found
- **500** Server error

**Bewijs:** Alle controllers gebruiken juiste codes

### 3️⃣ **Input Validation**
Alle POST/PUT endpoints valideren input:
- Required fields check
- Data type validation
- Length/range validation

**Bewijs:** [validators/](../../../validators/) folder met per-feature validators

### 4️⃣ **Protected Endpoints**
Endpoints die user data opvragen zijn beveiligd met JWT middleware

**Bewijs:** `authMiddleware` in [routes/](../../../routes/) files

---

## 📊 Totaal Design Coverage

| Endpoint Type | Example | Validatie | Error Handling | Auth |
|---|---|---|---|---|
| GET (list) | GET /api/anime | None | 404 resource | No |
| GET (detail) | GET /api/anime/:id | ID format | 404 resource | No |
| POST | POST /api/anime | Data validation | 400 bad request | Admin |
| PUT | PUT /api/ratings/:id | Data validation | 400/404 | User |
| DELETE | DELETE /favorites/:id | ID format | 404 resource | User |

Zie [evidence/diagrams](evidence/diagrams/) voor visuele request/response flows.
