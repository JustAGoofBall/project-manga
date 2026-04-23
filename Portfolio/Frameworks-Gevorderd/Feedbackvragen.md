# ❓ Feedbackvragen - Frameworks-Gevorderd (Alle Leeruitkomsten)

---

# 🧪 LEERUITKOMST 1: Geautomatiseerde Testen
*Ik kan mijn project testen door middel van geautomatiseerde testen.*

## Vraag 1: Test Coverage & Critical Paths
**Hoe compleet is mijn test suite en dekt het alle kritieke flows?**

### 📌 Bewijslast in Project:
- **Test Suite**: [tests/anime.test.js](../../../../tests/anime.test.js), [tests/auth.test.js](../../../../tests/auth.test.js), [tests/characters.test.js](../../../../tests/characters.test.js), [tests/ratings.test.js](../../../../tests/ratings.test.js), [tests/favorites.test.js](../../../../tests/favorites.test.js), [tests/errors.test.js](../../../../tests/errors.test.js)
- **Coverage Metrics**: 85% statements, 80% branches, 90% functions, 85% lines ([coverage/lcov-report/index.html](../../../../coverage/lcov-report/index.html))
- **Test Count**: 60+ passing tests georganiseerd in 6 suites
- **Integration Tests**: Volledige request flow testen (setup → request → database → response)
- **Test Configuration**: [jest.config.js](../../../../jest.config.js) met proper timeout en test environment
- **Error Scenarios**: Testen van 404, 409 (duplicates), 401 (auth), 400 (validation) responses

### Vragen:
1. Mijn 80% branch coverage kan nog hoger. **Welke edge cases of error scenarios mis ik?** Hoe kan ik zeker weten dat alle kritieke business flows (bijv. hele rating → favorite → delete flow) volledig getest zijn?
2. **Hoe test ik complexe scenario's** zoals cascade deletes (anime verwijderen → characters/ratings/favorites ook weg) en constraint violations? Merk je gaten in mijn huidige test strategieën?

---

## Vraag 2: Test Quality & Maintainability
**Zijn mijn tests goed gestructureerd, herbruikbaar en snél?**

### 📌 Bewijslast in Project:
- **Test Helpers**: `getAuthToken()`, `getAdminToken()` in [auth.test.js](../../../../tests/auth.test.js) om repetitie te vermijden
- **Setup/Teardown**: Proper `beforeEach()` en `afterAll()` voor database cleanup
- **Naming Convention**: Descriptieve test names: "should return 404 when anime not found"
- **Assertions**: Duidelijke expects met matchers (toBe, toContain, toHaveProperty)
- **Test Isolation**: Separate `anime_test.db` database per test run
- **Documentation**: JSDoc comments op test helper functies

### Vragen:
1. **Hoe kan ik mijn tests sneller en DRY-er maken?** Zie je mogelijkheden om meer test helpers te créeren (bijv. `createTestAnime()`, `createTestRating()`), of kan ik tests beter groeperen om database operations te minimaliseren?
2. **Hoe test ik de performance van mijn code?** Moet ik tests toevoegen voor slow queries, of moet ik mijn database queries zelf optimaliseren voordat ik ze test?

---

# 🏗️ LEERUITKOMST 2: Business Logic & Relaties
*Ik kan business logic en relaties binnen de model laag van mijn applicatie toepassen.*

## Vraag 1: Complex Relations & Constraints
**Hoe robuust zijn mijn relaties en constraints tussen entiteiten?**

### 📌 Bewijslast in Project:
- **Schema Relationships** ([schema.sql](../../../../schema.sql)):
  - anime → characters (1-to-many)
  - anime → ratings (1-to-many)
  - anime → favorites (1-to-many)
  - users → ratings (1-to-many)
  - users → favorites (1-to-many)
- **Unique Constraints**: anime.name, users.username, users.email, (user_id, anime_id) on ratings/favorites
- **Cascade Deletes**: Deleting anime removes all characters, ratings, favorites
- **CHECK Constraint**: ratings.rating BETWEEN 1 AND 10
- **Model Implementation** ([models/animeModel.js](../../../../models/animeModel.js), [models/ratingModel.js](../../../../models/ratingModel.js)): Queries gebruiken JOINs en aggregations

### Vragen:
1. **Hoe handig ik edge cases af in mijn model layer?** Bijv. wat gebeurt er als een user een rating verwijdert en daarna dezelfde anime opnieuw wil raten? Of als multiple CASCADE deletes tegelijk triggen? Zijn mijn constraints sterk genoeg?
2. **Hoe optimaliseer ik mijn queries?** In [animeModel.js](../../../../models/animeModel.js) haal ik anime + alle characters. Bij 1000 anime met elk 10 characters is dit inefficiënt. Moet ik pagination toevoegen, of lazy loading, of query optimization?

---

## Vraag 2: Data Aggregation & Transactions
**Hoe handle ik complexe multi-step operaties en data berekeningen?**

### 📌 Bewijslast in Project:
- **Aggregation Queries**: Average ratings per anime, count favorites, count characters
- **Multi-Table Queries**: Ratings met username en anime name, favorites met anime details
- **Foreign Key Operations**: Verifying anime_id/user_id exists before insert
- **Current Limitation**: Geen transaction support (bijv. create anime + characters atomair)
- **Database Abstraction** ([config/db.js](../../../../config/db.js)): Promise-based interface, parameterized queries

### Vragen:
1. **Hoe implementeer ik transacties veilig?** Stel je voor: admin maakt bulk upload (100 anime met characters). Halftisch crash: 50 anime inserted, characters niet. Hoe voorkoom ik inconsistente staat? Moet ik BEGIN TRANSACTION/COMMIT toevoegen?
2. **Waar kan ik queries beter optimaliseren?** Zie je potential N+1 query problems? Bijv. laad ik ratings en dan voor elk rating de username apart in plaats van 1 JOIN. Hoe detecteer ik dit soort inefficiëntie?

---

# 🎯 LEERUITKOMST 3: Scheiding Verantwoordelijkheden
*Ik scheid verantwoordelijkheden consistent in code en snap het belang hiervan.*

## Vraag 1: MVC Architecture & Layer Separation
**Zijn mijn models, controllers en routes goed van elkaar gescheiden?**

### 📌 Bewijslast in Project:
- **Model Layer** ([models/*.js](../../../../models/)): Data access + queries, geen HTTP logic
- **Controller Layer** ([controllers/*.js](../../../../controllers/)): HTTP request handling, parameter extraction, business logic orchestration
- **Route Layer** ([routes/*.js](../../../../routes/)): URL mapping, middleware stacking, endpoint definitions
- **Example Chain** [routes/anime.js](../../../../routes/anime.js) → `POST /anime` → authMiddleware → adminMiddleware → [animeController.create](../../../../controllers/animeController.js) → [animeModel.create](../../../../models/animeModel.js)
- **Validator Layer** ([validators/*.js](../../../../validators/)): Input validation, separate van model/controller
- **Consistent Pattern**: Alle controllers gebruiken try-catch, same response format

### Vragen:
1. **Waar verliest mijn code focus?** Zie je controllers die database queries doen (violation van model responsibility)? Of routes die business logic bevatten? Zijn er validators die je beter in model layer zou zetten?
2. **Hoe voorkom ik dat my code spaghetti-tig wordt als het groeit?** Met meer endpoints, hoe zorg ik dat model/controller scheiding streng blijft? Heb ik guidelines nodig of architectural patterns?

---

## Vraag 2: Middleware & Cross-Cutting Concerns
**Hoe efficiënt gebruik ik middleware voor cross-cutting concerns?**

### 📌 Bewijslast in Project:
- **Authentication** ([middleware/authMiddleware.js](../../../../middleware/authMiddleware.js)): JWT validation, token expiry, user attachment
- **Authorization** ([middleware/authMiddleware.js](../../../../middleware/authMiddleware.js)): Admin role checking (is_admin flag)
- **Error Handling** ([middleware/errorHandler.js](../../../../middleware/errorHandler.js)): Global error catcher, status mapping, stack trace control
- **Logging** ([middleware/logger.js](../../../../middleware/logger.js)): Request/response logging, colored output, file rotation
- **Middleware Stacking** ([routes/admin.js](../../../../routes/admin.js)): `authMiddleware → adminMiddleware → controller` pattern
- **Optional Auth** ([middleware/authMiddleware.js](../../../../middleware/authMiddleware.js)): `optionalAuth` voor public endpoints die users kunnen volgen

### Vragen:
1. **Hoe kan ik middleware effectiever inzetten?** Zit er nog logic in controllers die beter in middleware hoort? Bijv. validation, rate limiting, input sanitization?
2. **Hoe zorg ik dat middleware niet contradictoir wordt?** Met veel middleware (auth, optional auth, admin, validation) kan het ingewikkeld worden. Hoe test ik middleware interactions? Heb ik middleware combinaties die conflict creëren?

---

# 🔐 LEERUITKOMST 4: Veilige Code
*Ik schrijf veilige code d.m.v. kritisch nadenken en toepassen van authenticatie, autorisatie, validatie en foutafhandeling.*

## Vraag 1: Authentication & Authorization
**Hoe sterk zijn mijn auth implementatie en access controls?**

### 📌 Bewijslast in Project:
- **JWT Implementation** ([config/data.js](../../../../config/data.js)): 7-day expiration, signed secret
- **Password Security** ([models/userModel.js](../../../../models/userModel.js)): bcrypt hashing, 10 salt rounds, no plaintext storage
- **Token Validation** ([middleware/authMiddleware.js](../../../../middleware/authMiddleware.js)): jwt.verify() with error handling for expired/invalid tokens
- **Role-Based Access** ([middleware/authMiddleware.js](../../../../middleware/authMiddleware.js)): `adminMiddleware` checks `is_admin` flag
- **Protected Endpoints**: POST/PUT/DELETE anime/characters require admin, ratings require user auth
- **Error Messages**: No information leak ("Invalid credentials" not "User not found")
- **Token in Headers**: Bearer token in Authorization header (not cookies, not URL params)

### Vragen:
1. **Hoe kwetsbaar is mijn auth?** Wat gebeurt als iemand mijn JWT secret raadt (ik heb geen .env, secret is hardcoded)? Hoe handle ik token refresh (users zitten vast aan 7 dagen)? Zie je missing auth flows (logout, token revocation)?
2. **Zijn mijn authorization checks volledoende streng?** Ik check `is_admin` voor CRUD anime/characters. Maar wat als ik authorization op data-level nodig heb (user mag alleen eigen ratings/favorites zien)? Hoe test ik authorization bugs?

---

## Vraag 2: Input Validation & Error Handling
**Hoe goed bescherm ik tegen injection, malformed input en informatielekken?**

### 📌 Bewijslast in Project:
- **SQL Injection Protection** ([config/db.js](../../../../config/db.js)): Parameterized queries `db.prepare().bind()`, never string concatenation
- **Input Validation** ([validators/*.js](../../../../validators/)): 
  - Username: 3-50 chars, alphanumeric + underscore/hyphen
  - Email: regex validation + case normalization
  - Password: min 8 chars, mixed case/numbers, no spaces
  - Ratings: enforced 1-10 range
  - IDs: numeric validation
- **Error Response Format**: `{success: false, message: "User-friendly text"}` - no stack traces in production
- **Status Code Mapping** ([middleware/errorHandler.js](../../../../middleware/errorHandler.js)): 400 validation, 404 not found, 409 conflict, 500 server error
- **Validation Timing**: Validators run before controller, catch errors early
- **Check Constraints**: Database also validates ratings 1-10

### Vragen:
1. **Waar mis ik input validation?** Zijn er velden die ik NIET valideer? (bijv. review text in ratings - length limits? XSS prevention?) Wat als attackers sturen extreem lange strings, null values, of negatieve numbers?
2. **Hoe veilig is mijn error handling?** In development zie ik stack traces, maar in production niet. Maar log ik errors proper? Hoe voorkom ik dat exceptions user data exposeren? Moet ik input sanitization toevoegen bovenop validation?

---

# 💬 LEERUITKOMST 5: Code Review & Constructieve Feedback
*Ik kan kritisch naar code kijken en hier constructieve feedback op geven.*

## Vraag 1: Code Documentation & Clarity
**Hoe makkelijk kunnen anderen (of ik later) mijn code begrijpen en feedback geven?**

### 📌 Bewijslast in Project:
- **JSDoc Comments**: Alle functies hebben `@param`, `@returns`, beschrijving
- **Example**: [models/animeModel.js](../../../../models/animeModel.js) - `/** @param {string} name - Anime name @returns {Promise<Object>} */`
- **Naming Conventions**: camelCase functies, PascalCase classes, descriptive variable names
- **README**: [README.md](../../../../README.md) met setup, testing, API overview
- **AUTH-GUIDE**: [AUTH-GUIDE.md](../../../../AUTH-GUIDE.md) met auth flow details
- **Consistent Formatting**: Indentation, bracket style, spacing consistent
- **Error Messages**: Descriptieve meldingen ("Email already registered" niet "Duplicate key error")
- **Code Organization**: Related files in folders (models/, controllers/, routes/, etc)

### Vragen:
1. **Hoe kan ik mijn documentatie verbeteren voor code review?** Is mijn JSDoc compleet? Moet ik architecture diagrams toevoegen? Heb ik edge cases gedocumenteerd? Hoe zorg ik dat code reviewers weten WAAROM ik design choices maak?
2. **Welke code patterns herken je die verbeterd kunnen?** Zie je repetitieve code die extracted kan? Zie je functies die te complex zijn (too many responsibilities)? Hoe geef ik feedback op code die ik schreef?

---

## Vraag 2: Code Quality & Technical Debt
**Hoe herken ik code quality issues en hoe voorkom ik technical debt?**

### 📌 Bewijslast in Project:
- **DRY Principle**: Auth helpers hergebruikt in tests, middleware reused across routes
- **Error Handling**: Consistent try-catch pattern in alle controllers
- **Response Format**: Uniform JSON structure `{success, message/data, stack?}`
- **Database Abstraction** ([config/db.js](../../../../config/db.js)): Promise-based interface, easy to swap DB later
- **Test Coverage**: 85% coverage highlights untested code
- **Areas for Improvement**: 
  - No pagination (large datasets slow)
  - No rate limiting (brute force risk)
  - No caching (repeated queries slow)
  - No input sanitization (XSS risk if data displayed)
  - No transactions (multi-step operations unsafe)
  - Hardcoded config (security risk)

### Vragen:
1. **Hoe prioriteer ik technical debt?** Ik zie potentiele improvements (pagination, transactions, caching, sanitization). Welke moet ik EERST fixen? Welke zijn "nice to have"? Hoe weet ik wat architectural debt is vs normale optimizations?
2. **Hoe geef ik feedback op code die goeie intenties heeft maar suboptimaal is?** Bijv. queries die N+1 hebben, of validatie die redundant is met database constraints. Hoe geef ik dit constructief zodat iemand het begrijpt?

---

*Sturen naar: Docent Frameworks-Gevorderd / Timo*
