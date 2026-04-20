# ❓ Feedbackvragen - Leeruitkomst 2: Endpoints Opstellen

## Vraag 1: Hoe goed zijn mijn endpoints georganiseerd (public vs protected)?

**Wat ik heb:** 
- Public GET endpoints (alle anime/characters ophalen)
- Protected POST/PUT/DELETE endpoints (admin only)
- Middleware voor authentication checks

**Code:** [routes/anime.js](../../../../routes/anime.js), [middleware/authMiddleware.js](../../../../middleware/authMiddleware.js)
**Schema:** [schema.sql](../../../../schema.sql) (relaties anime-characters)

---

## Vraag 2: Hoe goed is mijn input validatie en error handling in endpoints?

**Wat ik heb:** 
- Input validators voor anime/character creation
- Error responses met juiste HTTP status codes
- Try/catch blocks in controllers

**Code:** [validators/animeValidator.js](../../../../validators/animeValidator.js), [controllers/animeController.js](../../../../controllers/animeController.js)
**Tests:** [tests/anime.test.js](../../../../tests/anime.test.js) - error cases

---

*Stuur deze vragen naar: Docent API-Basis*
