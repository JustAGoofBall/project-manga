# Bewijslast Leeruitkomst 4: Structural Design Pattern

## Projecten

(1) Lit, J. (2026). Project Manga - MVC Architecture implementation.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Model Layer (Database Only)**
    - `/models/animeModel.js` - Pure database queries (no HTTP code)
    - `/models/characterModel.js` - Character database operations
    - `/models/userModel.js` - User database operations
    - `/models/ratingModel.js` - Rating database operations
    - `/models/favoriteModel.js` - Favorite database operations
    - Pattern: All async statics, all return raw data

(3) **Controller Layer (Business Logic)**
    - `/controllers/animeController.js` - Anime business logic + validation
    - `/controllers/characterController.js` - Character logic
    - `/controllers/authController.js` - Authentication flow
    - `/controllers/ratingController.js` - Rating logic
    - `/controllers/favoriteController.js` - Favorite logic
    - Pattern: Calls models, validates input, catches errors

(4) **Route/View Layer**
    - `/routes/anime.js` - URL mapping to controllers
    - `/routes/auth.js` - Auth endpoints
    - `/routes/ratings.js` - Rating endpoints
    - `/routes/favorites.js` - Favorite endpoints
    - `/frontend/src/pages/` - React pages (view layer)
    - Pattern: Routes delegate to controller

(5) **Middleware (Cross-Cutting Concerns)**
    - `/middleware/authMiddleware.js` - Authentication verification
    - `/middleware/errorHandler.js` - Centralized error handling
    - `/middleware/logger.js` - Request/response logging
    - Pattern: Not in models/controllers/routes, applied globally

(6) **MVC Documentation**
    - File: `/Portfolio/Orientatie-Frameworks/Leeruitkomst-4-Structural-Design-Pattern/Motivatie.md`
    - Architecture diagram showing MVC layers
    - Request lifecycle documentation
    - Industry references (Rails, Django, Spring all use MVC)

(7) **Testing Evidence**
    - 60+ tests covering all layers
    - Models tested in isolation
    - Controllers tested with mocked models
    - Routes tested with full integration
    - Coverage report: `/coverage/lcov-report/index.html`

## Feedback

[Nog in te vullen door Timo & Samir]
