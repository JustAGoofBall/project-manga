# ❓ Feedbackvragen - Leeruitkomst 1: API's Bouwen

## Vraag 1: Zijn mijn REST endpoints correct gebouwd en georganiseerd?

**Wat ik heb:** 30+ endpoints in `/routes/`, gestructureerd per resource (anime, characters, auth, etc)
**Code:** [routes/anime.js](../../../../routes/anime.js), [routes/auth.js](../../../../routes/auth.js)
**Tests:** [tests/anime.test.js](../../../../tests/anime.test.js) (15 tests)

---

## Vraag 2: Is mijn foutafhandeling goed genoeg voor production?

**Wat ik heb:** Try/catch in controllers, validators, error messages per endpoint
**Code:** [controllers/animeController.js](../../../../controllers/animeController.js), [validators/animeValidator.js](../../../../validators/animeValidator.js)
**Tests:** [tests/errors.test.js](../../../../tests/errors.test.js)

---

*Stuur deze vragen naar: Docent API-Basis*
