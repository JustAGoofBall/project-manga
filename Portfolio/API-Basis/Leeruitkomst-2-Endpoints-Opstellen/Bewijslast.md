# Bewijslast Leeruitkomst 2: Endpoints Opstellen

## Projecten

(1) Lit, J. (2026). Project Manga - RESTful API design with professional endpoints.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **RESTful Design Principes Toegepast**
    - File: `/routes/anime.js` - Resource-based URLs
    - File: `/routes/auth.js` - Authentication endpoints
    - File: `/routes/ratings.js` - Sub-resource endpoints
    - Pattern: GET (read), POST (create), PUT (update), DELETE (delete)

(3) **Hierarchische URL Structuur**
    - `/api/anime` - Top level resource
    - `/api/anime/1` - Specific resource
    - `/api/anime/1/characters` - Sub-resource
    - `/api/anime/1/characters/5` - Specific sub-resource
    - `/api/anime/1/ratings` - Sub-resource collection
    - Clear relationship hierarchy

(4) **Controller Implementation**
    - File: `/controllers/animeController.js` - All CRUD operations
    - File: `/controllers/authController.js` - Auth endpoints
    - File: `/controllers/characterController.js` - Character endpoints
    - Pattern: Validation → Authorization → Database → Response
    - Consistent response format across all endpoints

(5) **Status Codes Per Endpoint**
    - 200 OK: GET, PUT successful
    - 201 Created: POST successful
    - 400 Bad Request: Validation failed
    - 401 Unauthorized: No token
    - 403 Forbidden: Limited authorization
    - 404 Not Found: Resource doesn't exist
    - 500 Server Error: System error

(6) **Query Parameters**
    - File: `/routes/search.js` - Search with query parameters
    - Example: `GET /api/search?q=naruto`
    - Filtering, sorting, pagination support

(7) **Middleware Integration**
    - File: `/middleware/authMiddleware.js` - Authentication
    - File: `/middleware/errorHandler.js` - Error handling
    - Applied per endpoint based on requirements

## Feedback

[Nog in te vullen door Timo & Samir]
