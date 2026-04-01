# Bewijslast Leeruitkomst 4: Veilige Code

## Projecten

(1) Lit, J. (2026). Project Manga - Secure implementation with authentication, validation, and error handling.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Authentication & Password Security**
    - File: `/models/userModel.js` - bcrypt password hashing
    - costRounds: 10 (balanced for security/speed)
    - File: `/controllers/authController.js` - JWT token generation
    - Tokens include: userId, email, expiresIn: 7d
    - Environment variable: JWT_SECRET (not hardcoded)

(3) **Authorization & Access Control**
    - File: `/middleware/authMiddleware.js` - Token verification
    - File: `/routes/anime.js` - adminMiddleware applied
    - Role checks: Admin only for create/update/delete
    - User checks: Only access own resources

(4) **Input Validation**
    - File: `/validators/animeValidator.js` - Type & length checks
    - File: `/validators/authValidator.js` - Email & password validation
    - All endpoints validate before processing
    - Consistent error messages

(5) **SQL Injection Prevention**
    - All queries use prepared statements (? placeholders)
    - File: `/config/db.js` - Database connection with pooling
    - Parameters always separate from SQL strings
    - No string concatenation in queries

(6) **Error Handling**
    - File: `/middleware/errorHandler.js` - Centralized error handling
    - Technical logs: console.error with full details
    - User responses: Generic messages (no technical info)
    - Graceful degradation: all errors caught, none crash server

(7) **Security Best Practices**
    - Environment variables for secrets (.env file)
    - HTTPS ready (can be deployed with SSL)
    - Rate limiting on login endpoint
    - Secure headers configured
    - Password minimum requirements enforced

## Feedback

[Nog in te vullen door Timo & Samir]
