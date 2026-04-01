# Bewijslast Leeruitkomst 2: Business Logic & Relaties

## Projecten

(1) Lit, J. (2026). Project Manga - Advanced database relaties en business logic.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Database Schema with Relations**
    - File: `/schema.sql` - Complete schema with foreign keys
    - UNIQUE constraints for preventing duplicates
    - ON DELETE CASCADE for data integrity
    - All 5 models with proper relationships

(3) **Model Layer Implementation**
    - File: `/models/animeModel.js` - Complex queries met JOINs
    - File: `/models/ratingModel.js` - Ratings with user info
    - File: `/models/characterModel.js` - Character relations
    - File: `/models/favoriteModel.js` - Favorite logic
    - All include business logic and validation

(4) **Query Examples**
    - LEFT JOIN for anime with characters
    - INNER JOIN for ratings with user details
    - ORDER BY for chronological ordering
    - GROUP BY for aggregations
    - Transaction handling for complex operations

(5) **Optimization Strategies**
    - Single query vs N+1 problem solved
    - Query indexing for performance
    - Efficient data structuring for responses
    - Connection pooling for scalability

(6) **Data Integrity Features**
    - Foreign key constraints
    - UNIQUE constraints for business rules
    - Transactions for atomic operations
    - Cascade delete for cleanup

## Feedback

[Nog in te vullen door Timo & Samir]
