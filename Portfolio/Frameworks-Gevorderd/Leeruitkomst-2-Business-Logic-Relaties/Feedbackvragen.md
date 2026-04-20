# ❓ Feedbackvragen - Leeruitkomst 2: Business Logic & Relaties

## Vraag 1: Database Relationships Implementatie
**Hoe goed heb ik complexe database relaties geïmplementeerd?**

### 📌 Bewijslast in Project:
- **Database Schema**: [schema.sql](../../../../schema.sql) - anime table, characters table, users table, ratings, favorites
- **1-to-Many**: Anime has many characters (anime_id FK in characters)
- **Many-to-Many**: Users have many favorites (join table user_favorites)
- **Complex Queries**: [models/animeModel.js](../../../../models/animeModel.js) - getById() met LEFT JOIN characters
- **Rating Model**: [models/ratingModel.js](../../../../models/ratingModel.js) - user-anime relationship
- **Tests**: [tests/characters.test.js](../../../../tests/characters.test.js), [tests/ratings.test.js](../../../../tests/ratings.test.js)

### Vragen:
- Zijn mijn 1-to-many en many-to-many relaties correct gemodelleerd en queried?
- Waar kan ik redundantie voorkomen? Zijn mijn queries efficient?
- Hoe kan ik complexere relaties beter handelen?

---

## Vraag 2: Business Rules Validatie
**Hoe effectief enforc ik bedrijfsregels in mijn code?**

### 📌 Bewijslast in Project:
- **Validators**: [validators/authValidator.js](../../../../validators/authValidator.js), [validators/ratingValidator.js](../../../../validators/ratingValidator.js)
- **Rating Rules**: 1-10 scale enforced, users kunnen alleen eigen ratings deleten
- **Auth Rules**: Wachtwoorden hashed met bcrypt, JWT tokens expiring
- **Permission Rules**: [middleware/authMiddleware.js](../../../../middleware/authMiddleware.js) - admin checks
- **Tests**: [tests/ratings.test.js](../../../../tests/ratings.test.js) - rating validation tests
- **Examples**: Controllers valideren input voordat database updates

### Vragen:
- Heb ik alle business rules correct gevalideerd? Zijn er gaten?
- Waar zou ik meer validatie moeten toevoegen?
- Hoe kan ik validatie meer centraliseren?

---

*Sturen naar: Docent Frameworks-Gevorderd / Timo & Samir*
