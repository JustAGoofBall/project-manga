# 🔗 Leeruitkomst 2: Business Logic & Relaties
*Ik kan business logic en relaties binnen de model laag van mijn applicatie toepassen.*

## Wat Ik Toon
Ik demonstreer dat ik **relationele data** correct ontwerp en **business logic** volledig in de model layer inkapsul:
- **3 relationship types:** 1-to-many (anime ↔ characters), many-to-many (users ↔ favorites), many-to-many with extra data (users ↔ ratings ↔ anime)
- **Efficient queries:** JOINs, LEFT JOINs, aggregations (AVG ratings, COUNT favorites)
- **Database constraints:** Foreign keys, CASCADE deletes, UNIQUE constraints, CHECK constraints
- **Model encapsulation:** Controllers never know about relationship logic
- **No N+1 queries:** All related data fetched efficiently

**Statistieken:**
- **Relationships:** 3 types properly modeled
- **Models:** 5 classes with relationship logic
- **Queries:** All parameterized (SQL injection safe)
- **Tests:** All relationships verified with integration tests

## Hoe Dit In Mijn Project Zichtbaar Is
- **Database Schema:** [schema.sql](../../../schema.sql) - All relationships with proper keys
- **Models:** [models/](../../../models/) - Each model encapsulates relationship logic
- **Integration Tests:** [tests/](../../../tests/) - All relationships tested
- **Demonstratie:** Zie [RELATIES.md](RELATIES.md) voor complete schema diagrams en code examples
