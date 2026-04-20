# ❓ Feedbackvragen - Leeruitkomst 3: Resource Beheren Met Framework/ORM

## Vraag 1: Database Relaties & ORM Patroon
**Hoe effectief zet ik database relaties om in mijn application code?**

### 📌 Bewijslast in Project:
- **Database Schema**: [schema.sql](../../../../schema.sql) - 1-to-many (anime-characters) en many-to-many (user-favorites) relaties
- **Models**: [models/animeModel.js](../../../../models/animeModel.js) - JOIN queries voor relaties
- **Character Model**: [models/characterModel.js](../../../../models/characterModel.js) - relatie met anime
- **Rating Model**: [models/ratingModel.js](../../../../models/ratingModel.js) - user-rating relatie
- **Queries**: getById() met LEFT JOIN, many-to-many in favorites

### Vragen:
- Heb ik alle relaties (1-to-many, many-to-many) correct gemodelleerd?
- Zou ik beter gebruik kunnen maken van een échte ORM (bijv. Prisma, Sequelize)?
- Hoe kan ik mijn SQL queries nog beter optimaliseren?

---

## Vraag 2: CRUD Operaties & Performance
**Zijn mijn CRUD operaties optimaal en schaalbaar?**

### 📌 Bewijslast in Project:
- **CRUD Endpoints**: [routes/anime.js](../../../../routes/anime.js) - CREATE/READ/UPDATE/DELETE operaties
- **Controllers**: [controllers/animeController.js](../../../../controllers/animeController.js) - business logic
- **Transactions**: Error handling in controller try/catch
- **Tests**: [tests/anime.test.js](../../../../tests/anime.test.js) - CRUD test coverage
- **Performance**: Directe SQL queries (sneller dan ORM overhead voor dit schaal)

### Vragen:
- Hoe goed omgaa ik met database resources (connecties, queries)?
- Welke optimalisaties kan ik toevoegen? (caching, lazy loading, pagination)
- Zou ik connection pooling moeten implementeren?

---

*Sturen naar: Docent Orientatie-Frameworks*
