# Bewijslast Leeruitkomst 3: Scheiding van Verantwoordelijkheden

## Projecten

(1) Lit, J. (2026). Project Manga - Professional MVC architecture with clear separation of concerns.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **MVC Layer Separation**
    - File: `/routes/` - URL mapping only (no logic)
    - File: `/controllers/` - Business logic only (no SQL)
    - File: `/models/` - Database queries only (no HTTP)
    - File: `/middleware/` - Cross-cutting concerns
    - File: `/validators/` - Reusable input validation

(3) **Middleware Implementation**
    - File: `/middleware/authMiddleware.js` - Authentication concerns
    - File: `/middleware/errorHandler.js` - Centralized error handling
    - File: `/middleware/logger.js` - Request/response logging
    - Applied globally, not scattered in routes/controllers

(4) **Testing Separation**
    - File: `/tests/anime.test.js` - Tests each layer separately
    - Unit tests: Models in isolation
    - Controller tests: With mock models
    - Integration tests: Full request/response cycle
    - Each test focused on one concern

(5) **Refactoring Evidence**
    - Clear before/after: mixed code → separated layers
    - Git history showing evolution to cleaner architecture
    - Consistent patterns applied across all resources
    - New resources follow same structure automatically

(6) **Code Examples in Documentation**
    - File: `/Portfolio/Frameworks-Gevorderd/Leeruitkomst-3-Scheiding-Verantwoordelijkheden/Motivatie.md`
    - Shows what belongs in each layer
    - Demonstrates benefits of separation
    - Testability, reusability, maintainability proven

## Feedback

[Nog in te vullen door Timo & Samir]
