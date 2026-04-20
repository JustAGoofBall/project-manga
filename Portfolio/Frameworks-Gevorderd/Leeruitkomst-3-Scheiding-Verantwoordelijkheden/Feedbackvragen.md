# ❓ Feedbackvragen - Leeruitkomst 3: Scheiding van Verantwoordelijkheden

## Vraag 1: Lagenarchitectuur & Separation of Concerns
**Hoe goed scheid ik mijn code in duidelijke lagen (Models, Controllers, Routes)?**

### 📌 Bewijslast in Project:
- **Routes Layer**: [routes/anime.js](../../../../routes/anime.js), [routes/auth.js](../../../../routes/auth.js) - HTTP routing alleen
- **Controllers Layer**: [controllers/animeController.js](../../../../controllers/animeController.js) - business logic, request handling
- **Models Layer**: [models/animeModel.js](../../../../models/animeModel.js) - database queries only
- **Middleware Layer**: [middleware/authMiddleware.js](../../../../middleware/authMiddleware.js), [middleware/errorHandler.js](../../../../middleware/errorHandler.js)
- **Validators**: [validators/](../../../../validators/) - input validation separate
- **Architecture**: Duidelijke flow: Route → Middleware → Controller → Model

### Vragen:
- Heeft elke laag een duidelijke verantwoordelijkheid? Zit er mixing van concerns?
- Waar vermengt ik verantwoordelijkheden nog? (bijv. database logic in controllers)
- Hoe kan ik de scheiding nog strakker maken?

---

## Vraag 2: Service Layer & Code Reuse
**Zou ik beter gebruik kunnen maken van service layers of helpers?**

### 📌 Bewijslast in Project:
- **Current Structure**: Models → Controllers (direct)
- **Opportunity**: Service layer tussen Controllers en Models
- **Repetition**: Vergelijkbare logica in [controllers/](../../../../controllers/) could be abstracted
- **Helpers**: [middleware/](../../../../middleware/) some helpers, but could be expanded
- **DRY**: Validators are reused across controllers

### Vragen:
- Welke logica zou ik uit controllers kunnen halen naar Services?
- Waar breken ik het DRY principe en kan ik beter refactoren?
- Zou ik utility functions meer moeten gebruiken?

---

*Sturen naar: Docent Frameworks-Gevorderd / Timo & Samir*
