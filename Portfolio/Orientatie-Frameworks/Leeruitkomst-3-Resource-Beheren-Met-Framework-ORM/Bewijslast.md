# Bewijslast Leeruitkomst 3: Resource Beheren Met Framework & ORM

## Projecten

(1) Lit, J. (2026). Project Manga - ORM Models with complete CRUD operations.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **CRUD Models (ORM-laag)**
    - `/models/animeModel.js` - Complete anime CRUD
    - `/models/characterModel.js` - Nested character CRUD
    - `/models/userModel.js` - User management
    - `/models/ratingModel.js` - Rating operations
    - `/models/favoriteModel.js` - Favorite management

(3) **Framework Routes met ORM**
    - `/routes/anime.js` - All anime endpoints (GET, POST, PUT, DELETE)
    - `/routes/characters.js` - Character endpoints
    - `/routes/auth.js` - User registration/login
    - `/routes/ratings.js` - Rating endpoints
    - `/routes/favorites.js` - Favorite endpoints

(4) **Database Relations**
    - Foreign keys: anime_id → characters
    - User relationships: one-to-many ratings/favorites
    - Cascading deletes implemented
    - Referential integrity maintained

(5) **API Testing Evidence**
    - 60+ automated tests covering CRUD
    - Test file: `/tests/anime.test.js` (all CRUD operations tested)
    - Coverage: 85%+ on models
    - All tests passing ✓

(6) **Frontend Integration**
    - Anime listing (GET): `/frontend/src/pages/Home.jsx`
    - Detail page (GET one): `/frontend/src/pages/AnimeDetail.jsx`
    - Create form (POST): `/frontend/src/pages/AdminPanel.jsx`
    - Update functionality: Implemented in detail view
    - Delete buttons: Implemented in admin panel

## Database Schema

- Anime table: id, name, created_at, updated_at
- Characters table: id, name, anime_id (FK), created_at, updated_at
- Users table: id, username, email, password_hash, is_admin, created_at
- Ratings table: id, user_id (FK), anime_id (FK), rating, review
- Favorites table: id, user_id (FK), anime_id (FK)

## Feedback

[Nog in te vullen door Timo & Samir]
