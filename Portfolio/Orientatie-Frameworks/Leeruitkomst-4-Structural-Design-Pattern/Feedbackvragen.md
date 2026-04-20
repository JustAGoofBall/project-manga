# ❓ Feedbackvragen - Leeruitkomst 4: Structural Design Patterns

## Vraag 1: Design Patterns Toepassing
**Welke design patterns heb ik correct toegepast in mijn project?**

### 📌 Bewijslast in Project:
- **MVC Pattern**: [routes/](../../../../routes/), [controllers/](../../../../controllers/), [models/](../../../../models/) scheiden concerns
- **Middleware Pattern**: [middleware/](../../../../middleware/) - authMiddleware, errorHandler, logger
- **Repository Pattern**: Models als data access layer ([models/animeModel.js](../../../../models/animeModel.js))
- **Strategy Pattern**: Different validators voor verschillende resources ([validators/](../../../../validators/))
- **Factory Pattern**: User creation in [controllers/authController.js](../../../../controllers/authController.js)

### Vragen:
- Is mijn MVC structuur een goede toepassing van het Model-View-Controller pattern?
- Zouden andere design patterns beter geschikt zijn?
- Hoe kan ik patterns nog consistenter toepassen?

---

## Vraag 2: Code Organisatie & Schaalbaarheid
**Hoe goed is mijn project georganiseerd voor groei en onderhoud?**

### 📌 Bewijslast in Project:
- **Folder Structure**: Duidelijke scheiding per concern (routes, controllers, models, middleware, validators)
- **Naming Conventions**: Consistent naming (animeController.js, animeValidator.js, animeModel.js)
- **Modularity**: Elke router in eigen file, gemakkelijk uit te breiden
- **Configuration**: [config/data.js](../../../../config/data.js), [config/db.js](../../../../config/db.js) - centraliseerde config
- **Scalability**: Makkelijk om resources toe te voegen (characters, ratings, etc.)

### Vragen:
- Zouden mijn Controllers nog beter opgedeeld kunnen worden?
- Hoe kan ik mijn code structuur verbeteren voor een groter team?
- Zou ik service layers moeten introduceren?

---

*Sturen naar: Docent Orientatie-Frameworks*
