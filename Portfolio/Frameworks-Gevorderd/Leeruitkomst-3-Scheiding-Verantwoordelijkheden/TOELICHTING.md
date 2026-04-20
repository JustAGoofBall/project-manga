# 🎯 Leeruitkomst 3: Scheiding van Verantwoordelijkheden

## Wat Ik Toon
Ik demonstreer dat ik **verantwoordelijkheden consequent scheid**:
- Models: Database access only
- Controllers: Business logic only
- Routes: URL routing only
- Middleware: Cross-cutting concerns only
- Validators: Input validation only

**Bewijs:**
- Duidelijke folder structuur
- Elk bestand heeft 1 verantwoordelijkheid
- Geen code duplication
- Makkelijk om te testen en maintainen

## Hoe Dit In Mijn Project Zichtbaar Is
- **Models:** [models/](../../../models/) 
- **Controllers:** [controllers/](../../../controllers/)
- **Routes:** [routes/](../../../routes/)
- **Middleware:** [middleware/](../../../middleware/)
- **Validators:** [validators/](../../../validators/)
- **Demonstratie:** Zie [VERANTWOORDELIJKHEDEN.md](VERANTWOORDELIJKHEDEN.md)
