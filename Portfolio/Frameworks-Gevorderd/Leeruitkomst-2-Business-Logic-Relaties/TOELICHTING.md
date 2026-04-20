# 🔗 Leeruitkomst 2: Business Logic & Relaties

## Wat Ik Toon
Ik demonstreer dat ik **business logic goed inkapsul** en **relationele data** correct implementeer:
- Anime ↔ Characters (1-to-many)
- User ↔ Ratings (1-to-many)
- User ↔ Favorites (many-to-many via junction table)
- Efficient queries met JOINs
- Encapsulated in model layer

**Bewijs:**
- Database schema met relaties
- Model classes met relationship methods
- JOIN queries optimized
- Controllers dont know about relationships (Models handle it)

## Hoe Dit In Mijn Project Zichtbaar Is
- **Schema:** [schema.sql](../../../schema.sql) - Shows all relationships
- **Models:** [models/](../../../models/) - Relationship logic encapsulated
- **Queries:** Models execute JOINs, not controllers  
- **Demonstratie:** Zie [RELATIES.md](RELATIES.md) voor diagrams
