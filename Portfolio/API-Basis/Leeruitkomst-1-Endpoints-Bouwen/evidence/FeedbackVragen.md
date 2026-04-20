# ❓ Feedbackvragen - Leeruitkomst 1: API's Bouwen

## Vraag 1: Zijn mijn REST endpoints correct gebouwd en georganiseerd?

**Wat ik heb:** 30+ endpoints in `/routes/`, gestructureerd per resource (anime, characters, auth, etc) eerst had ik alles in 1 file, later had ik mijn mappenstructuur verbeterd
**Code:** [routes/anime.js](../../../../routes/anime.js), [routes/auth.js](../../../../routes/auth.js)
**Tests:** [tests/anime.test.js](../../../../tests/anime.test.js) (15 tests)

---

## Vraag 2: Zijn mijn foutafhandeling goed genoeg of zijn er nog verbeteringen die ik kan toepassen?

**Wat ik heb:** Try/catch in controllers, validators, error messages per endpoint
**Code:** [controllers/animeController.js](../../../../controllers/animeController.js), [validators/animeValidator.js](../../../../validators/animeValidator.js)
**Tests:** [tests/errors.test.js](../../../../tests/errors.test.js)

---

