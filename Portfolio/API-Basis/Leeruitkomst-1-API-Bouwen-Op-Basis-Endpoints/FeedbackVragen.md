# ❓ Feedbackvragen - Leeruitkomst 1: API's Bouwen Op Basis Endpoints

## Vraag 1: Endpoint Design & RESTful Principes
**Hoe goed voldoen de 30+ endpoints aan RESTful API-principes?**

### 📌 Bewijslast in Project:
- **Routes**: [routes/anime.js](../../../../routes/anime.js), [routes/auth.js](../../../../routes/auth.js), [routes/characters.js](../../../../routes/characters.js)
- **Voorbeeld**: GET `api/anime` (getAll), GET `api/anime/:id` (getById), POST/PUT/DELETE (CRUD)
- **Test Evidence**: [tests/anime.test.js](../../../../tests/anime.test.js) - 15 geautomatiseerde tests
- **Coverage**: [coverage/lcov-report/index.html](../../../../coverage/lcov-report/index.html) - 85% code coverage

### Vragen:
- Zijn mijn resource routes correct gestructureerd? Voldoen ze aan REST conventions?
- Heb ik de juiste HTTP-methoden gebruikt en status codes teruggegeven?

---

## Vraag 2: Foutafhandeling & Input Validatie
**Is mijn foutafhandeling in endpoints robuust genoeg?**

### 📌 Bewijslast in Project:
- **Controllers**: [controllers/animeController.js](../../../../controllers/animeController.js) - try/catch error handling
- **Validators**: [validators/animeValidator.js](../../../../validators/animeValidator.js), [validators/authValidator.js](../../../../validators/authValidator.js)
- **Example Error Response**: Status 400/404/500 met duidelijke error messages
- **Tests**: [tests/errors.test.js](../../../../tests/errors.test.js) - error handling tests

### Vragen:
- Zijn mijn error messages specifiek genoeg? Helpen ze developers?
- Heb ik alle edge cases getest? (invalid input, missing fields, wrong types)

---

*Sturen naar: Docent API-Basis*
