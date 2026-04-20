# ❓ Feedbackvragen - Leeruitkomst 2: Endpoints Opstellen

## Vraag 1: Database Queries & Performance Optimalisatie
**Hoe efficiënt zijn mijn database queries in de endpoint controllers?**

### 📌 Bewijslast in Project:
- **Models**: [models/animeModel.js](../../../../models/animeModel.js), [models/ratingModel.js](../../../../models/ratingModel.js)
- **Database Setup**: [config/db.js](../../../../config/db.js)
- **Schema**: [schema.sql](../../../../schema.sql) - database relaties en indexes
- **Example Query**: getAll() met LEFT JOIN voor characters relation
- **Tests**: [tests/anime.test.js](../../../../tests/anime.test.js) - performance van queries getested

### Vragen:
- Zijn er N+1 query problems die ik gemist heb?
- Hoe kan ik mijn database queries verder optimaliseren?
- Zou ik pagination moeten toevoegen voor grote datasets?

---

## Vraag 2: Autorisatie & Beveiliging
**Is mijn autorisatielogica correct geïmplementeerd in endpoints?**

### 📌 Bewijslast in Project:
- **Auth Middleware**: [middleware/authMiddleware.js](../../../../middleware/authMiddleware.js) - JWT verification
- **Protected Routes**: [routes/anime.js](../../../../routes/anime.js) - POST/PUT/DELETE protected met adminMiddleware
- **Example**: Anime POST mag alleen admin, ratings kunnen users zelf beheren
- **Tests**: [tests/auth.test.js](../../../../tests/auth.test.js) - unauthorized access tests

### Vragen:
- Bescherm ik alle gevoelige endpoints goed (admin, user-specific)?
- Hoe kan ik mijn permission checks nog verbeteren?

---

*Sturen naar: Docent API-Basis*
