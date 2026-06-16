# 🎯 Leeruitkomst 3: Scheiding van Verantwoordelijkheden
*Ik scheid verantwoordelijkheden consistent in code en snap het belang hiervan.*

## Wat Ik Toon
Ik demonstreer dat ik een **strikt MVC/layered architecture** volg met duidelijke scheiding:
- **Models:** Database queries ONLY (no HTTP logic)
- **Controllers:** Business logic orchestration (no database calls, no validation)
- **Routes:** URL mapping & middleware stacking (no business logic)
- **Middleware:** Cross-cutting concerns (auth, error handling, logging)
- **Validators:** Input validation ONLY (no database access)
- **Result:** Clean, testable, maintainable code

**Bewijs:**
- Geen code duplication (reusable validators)
- Makkelijk testbaar (mocken per layer)
- Clear separation (één verantwoordelijkheid per file)
- **Feedback from Ron (2026-04-23):** "Excellent MVC structure"

## Hoe Dit In Mijn Project Zichtbaar Is
- **Models:** [models/](../../../models/) (5 classes) - Pure database access only
- **Controllers:** [controllers/](../../../controllers/) (5 files) - Orchestration only
- **Routes:** [routes/](../../../routes/) (6 files) - URL mapping only
- **Middleware:** [middleware/](../../../middleware/) (3 files) - Cross-cutting concerns
- **Validators:** [validators/](../../../validators/) (5 files) - Input validation only
- **Demonstratie:** Zie [VERANTWOORDELIJKHEDEN.md](VERANTWOORDELIJKHEDEN.md) voor complete before/after examples
