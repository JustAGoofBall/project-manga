# 📋 Endpoint Showcase - Project Manga API

## Alle Geïmplementeerde Routes

### 🎬 **Anime Endpoints** 
`/routes/anime.js` - 6 endpoints
```
GET    /api/anime              → List alle anime
GET    /api/anime/:id          → Detail view 1 anime
POST   /api/anime              → Create nieuwe anime (admin only)
PUT    /api/anime/:id          → Update anime (admin only)
DELETE /api/anime/:id          → Delete anime (admin only)
GET    /api/search/anime       → Search anime by name/filters
```

### 👥 **Character Endpoints**
`/routes/characters.js` - 5 endpoints
```
GET    /api/anime/:id/characters     → List alle characters van anime
GET    /api/characters/:id           → Details 1 character
POST   /api/characters               → Create karakter (admin)
PUT    /api/characters/:id           → Update karakter (admin)
DELETE /api/characters/:id           → Delete karakter (admin)
```

### 🔐 **Authentication Endpoints**
`/routes/auth.js` - 4 endpoints
```
POST   /api/auth/register      → Register user
POST   /api/auth/login         → Login user + return JWT token
GET    /api/auth/profile       → Get user profile (protected)
PUT    /api/auth/profile       → Update profile (protected)
```

### ⭐ **Favorites Endpoints**
`/routes/favorites.js` - 3 endpoints
```
GET    /api/favorites          → Get user's favorite anime (protected)
POST   /api/favorites          → Add anime to favorites (protected)
DELETE /api/favorites/:id      → Remove anime from favorites (protected)
```

### ⭐ **Ratings Endpoints**
`/routes/ratings.js` - 4 endpoints
```
GET    /api/ratings/anime/:id  → View all ratings for anime
POST   /api/ratings            → Create rating for anime (protected)
PUT    /api/ratings/:id        → Update my rating (protected)
DELETE /api/ratings/:id        → Delete rating (protected)
```

### 🔧 **Admin Routes**
`/routes/admin.js` - Special endpoints
```
GET    /api/admin/stats        → System statistics (admin only)
POST   /api/admin/seed         → Seed database with demo data
```

### 🔍 **Search Routes**
`/routes/search.js` - Advanced search
```
GET    /api/search             → Global search across anime/characters
```

---

## 📊 REST Principe Toepassing

### Status Codes Gebruikt:
- **200** ✅ OK - Request succesvolle
- **201** ✅ Created - Nieuwe resource aangemaakt
- **400** ❌ Bad Request - Invalid input
- **401** ❌ Unauthorized - Authentication vereist
- **403** ❌ Forbidden - Authorization mislukt
- **404** ❌ Not Found - Resource bestaat niet
- **500** ❌ Server Error - Onverwachte fout

### HTTP Methods Correct Gebruikt:
- **GET** - Ophalen data (safe, idempotent)
- **POST** - Data toevoegen (not idempotent)
- **PUT** - Update bestaande (idempotent)
- **DELETE** - Verwijderen (idempotent)

---

## 📈 Totaal:
**8 route-files | 25+ endpoints | Volledige REST API**

Zie [evidence/screenshots](evidence/screenshots/) en [evidence/diagrams](evidence/diagrams/) voor visuele representatie van alle routes.
