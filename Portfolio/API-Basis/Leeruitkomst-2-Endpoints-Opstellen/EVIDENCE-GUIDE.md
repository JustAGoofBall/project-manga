# 📸 Evidence Guide - Leeruitkomst 2: Endpoints Opstellen

Deze guide laat zien **welke files je moet screenshotten** en **welke Postman requests te testen**.

---

## 📂 PART 1: CODE FILES TE SCREENSHOTTEN

### 1️⃣ Screenshot: animeController.js - CRUD Methods

**Bestand:** `/controllers/animeController.js`

**Wat te screenshotten:**
- `getAllAnime()` method (lines 1-30)
- `getAnimeById()` method (lines 35-60)
- `createAnime()` method (lines 65-80)

**Waarom:** Toont alle CRUD operaties (Create, Read, Update delete basis):
- GET all → `res.json()` met 200
- GET by ID → 404 handling als not found
- POST create → `201 Created` status code

**Voorbeeld:**
```
SCREENSHOT: GET alle anime, GETById, POST create
```

---

### 2️⃣ Screenshot: ratingController.js - Complex Endpoints

**Bestand:** `/controllers/ratingController.js`

**Wat te screenshotten:**
- `getRatingsForAnime()` method
- `createRating()` method

**Waarom:** Toont:
- Validatie van parameters (line 6: `validateAnimeId()`)
- Nested routes (`/api/anime/:animeId/ratings`)
- Proper error handling (404 checks)
- Berekeningen (average rating)

**Voorbeeld:**
```
SCREENSHOT: Complex endpoint met validatie & berekening
```

---

### 3️⃣ Screenshot: animeValidator.js - Input Validation

**Bestand:** `/validators/animeValidator.js`

**Wat te screenshotten:**
- `validateAnimeName()` function (lines 1-50)
- Alle validation checks:
  - Required check
  - Type checking
  - Length validation (min/max)
  - Trimming whitespace

**Waarom:** Toont je **validatie strategie**:
- Reject invalid input met 400 errors
- Consistent error messages
- Data sanitization (trim)

**Voorbeeld:**
```js
// Validation voor anime name:
- if (!name) → Error: 'Anime name is required'
- if (length < 1) → Error
- if (length > 100) → Error
```

---

### 4️⃣ Screenshot: errorHandler.js - Error Middleware

**Bestand:** `/middleware/errorHandler.js`

**Wat te screenshotten:**
- Error handling middleware
- Status code logic (400, 404, 500)
- Consistent error response format

**Waarom:** Toont je **centralized error handling** design

---

## 🔌 PART 2: POSTMAN REQUESTS (Test & Screenshot)

### Setup in Postman:
```
Base URL: http://localhost:3000
Header: Content-Type: application/json
(Add Authorization: Bearer {token} als endpoint beveiligd is)
```

---

## ✅ REQUEST 1: GET All Anime (Success)

**Purpose:** Show GET with 200 response

```
METHOD: GET
URL: http://localhost:3000/api/anime

EXPECTED RESPONSE (200 OK):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Naruto",
      "created_at": "2026-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "One Piece",
      "created_at": "2026-01-16T12:00:00Z"
    },
    ...
  ]
}
```

**Screenshot:** Body tonen met array van anime's + status code 200

---

## ✅ REQUEST 2: GET Specific Anime (Success)

**Purpose:** Show getById with specific data

```
METHOD: GET
URL: http://localhost:3000/api/anime/1

EXPECTED RESPONSE (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Naruto",
    "characters": [
      { "id": 1, "name": "Naruto Uzumaki" },
      { "id": 2, "name": "Sasuke Uchiha" }
    ],
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

**Screenshot:** Data met characters relationship + 200 status

---

## ✅ REQUEST 3: GET Anime Not Found (Error)

**Purpose:** Show 404 error handling

```
METHOD: GET
URL: http://localhost:3000/api/anime/9999

EXPECTED RESPONSE (404 Not Found):
{
  "success": false,
  "message": "Anime not found"
}
```

**Screenshot:** Error response + 404 status code

---

## ✅ REQUEST 4: POST Create Anime (Success)

**Purpose:** Show POST with 201 Created status

```
METHOD: POST
URL: http://localhost:3000/api/anime

BODY (JSON):
{
  "name": "Attack on Titan"
}

EXPECTED RESPONSE (201 Created):
{
  "success": true,
  "message": "Anime created successfully",
  "data": {
    "id": 6,
    "name": "Attack on Titan",
    "created_at": "2026-04-20T14:30:00Z"
  }
}
```

**Screenshot:** POST request + 201 status code

---

## ❌ REQUEST 5: POST Invalid Input (Validation Error)

**Purpose:** Show 400 validation error

```
METHOD: POST
URL: http://localhost:3000/api/anime

BODY (JSON) - EMPTY NAME:
{
  "name": ""
}

EXPECTED RESPONSE (400 Bad Request):
{
  "success": false,
  "message": "Anime name is required"
}
```

**Screenshot:** Invalid data + 400 error + validation message

---

## ✅ REQUEST 6: POST Name Too Long (Validation Error)

**Purpose:** Show validation max-length check

```
METHOD: POST
URL: http://localhost:3000/api/anime

BODY (JSON) - NAME > 100 chars:
{
  "name": "This is a very very very very very very very very very very very very long anime name that exceeds 100 characters limit"
}

EXPECTED RESPONSE (400 Bad Request):
{
  "success": false,
  "message": "Anime name must be less than 100 characters"
}
```

**Screenshot:** Long input + 400 error

---

## ✅ REQUEST 7: GET Ratings for Anime

**Purpose:** Show complex nested endpoint

```
METHOD: GET
URL: http://localhost:3000/api/anime/1/ratings

EXPECTED RESPONSE (200 OK):
{
  "success": true,
  "anime": {
    "id": 1,
    "name": "Naruto"
  },
  "average": 8.5,
  "count": 4,
  "data": [
    {
      "id": 1,
      "rating": 9,
      "review": "Amazing!",
      "username": "user1",
      "created_at": "2026-04-15T10:00:00Z"
    },
    {
      "id": 2,
      "rating": 8,
      "review": "Very good",
      "username": "user2",
      "created_at": "2026-04-16T11:00:00Z"
    }
  ]
}
```

**Screenshot:** Nested endpoint + ratings aggregation (average)

---

## 📸 SCREENSHOT CHECKLIST

**Create these 6 screenshots for evidence:**

- [ ] **Screenshot 1:** animeController.js code (CRUD methods)
- [ ] **Screenshot 2:** ratingController.js code (validatie + nested routes)
- [ ] **Screenshot 3:** animeValidator.js code (validation logic)
- [ ] **Screenshot 4:** Postman - GET /api/anime (200 success)
- [ ] **Screenshot 5:** Postman - POST with validation error (400)
- [ ] **Screenshot 6:** Postman - GET /api/anime/:id/ratings (nested endpoint)

---

## 💾 WAAR OPSLAAN

Plaats screenshots in:
```
Portfolio/API-Basis/Leeruitkomst-2-Endpoints-Opstellen/evidence/
├── 1-animeController-CRUD.png
├── 2-ratingController-complex.png
├── 3-animeValidator-validation.png
├── 4-postman-get-all-anime.png
├── 5-postman-validation-error.png
└── 6-postman-nested-ratings.png
```

---

## ✅ QA Checklist

**Zorg dat je screenshots tonen:**

- ✅ GET request met 200 response
- ✅ POST request met 201 response
- ✅ 400 validation error (invalid data)
- ✅ 404 not found error
- ✅ Code met proper status codes in response
- ✅ Validation logic in code
- ✅ Complex endpoint met nested routes

**Dit toont dat je kan:**
- ✅ RESTful endpoint design (correct HTTP codes)
- ✅ Input validation
- ✅ Error handling
- ✅ Complex endpoint design (nested routes)
- ✅ Consistent response format
