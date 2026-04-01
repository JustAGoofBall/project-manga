# Bewijslast Leeruitkomst 1: API's Bouwen Op Basis van Endpoints

## Projecten

(1) Lit, J. (2026). Project Manga - Complete REST API with 30+ endpoints.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Anime Endpoints**
    - File: `/routes/anime.js` - Route definitions
    - File: `/controllers/animeController.js` - Business logic
    - File: `/models/animeModel.js` - Database queries
    - 5 endpoints: GET, GET/:id, POST, PUT, DELETE

(3) **Authentication & Ratings Endpoints**
    - File: `/routes/auth.js` - Auth endpoints
    - File: `/controllers/authController.js` - Auth logic
    - File: `/routes/ratings.js` - Rating endpoints
    - File: `/controllers/ratingController.js` - Rating logic
    - JWT tokens, password hashing, protected endpoints

(4) **Complete Endpoint Coverage**
    - Characters: `/routes/characters.js`, `/controllers/characterController.js`
    - Favorites: `/routes/favorites.js`, `/controllers/favoriteController.js`
    - Admin: `/routes/admin.js`, `/controllers/adminController.js`
    - Search: `/routes/search.js`, `/controllers/searchController.js`
    - Total: 30+ endpoints tested and working

(5) **Database Architecture**
    - File: `/schema.sql` - Database schema with relations
    - Files: `/models/*.js` - All model files with CRUD
    - Relations: users → ratings, favorites, anime → characters

(6) **Error Handling & Status Codes**
    - File: `/middleware/errorHandler.js` - Centralized error handling
    - Proper status codes: 200, 201, 400, 401, 403, 404, 500
    - Consistent error response format

(7) **Request/Response Examples**
    - All documented in `/Portfolio/API-Basis/Leeruitkomst-1-API-Bouwen-Op-Basis-Endpoints/Motivatie.md`
    - JSON response format consistent across all endpoints
    - Authentication via JWT tokens

## Feedback

[Nog in te vullen door Timo & Samir]
