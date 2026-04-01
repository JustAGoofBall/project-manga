# Leeruitkomst 3: Resource Beheren Met Framework & ORM

## Motivatie

Ik ben in staat om middels een framework (Express.js) met ORM (Models) een resource volledig te beheren met alle CRUD-operaties (Create, Read, Update, Delete). Dit heb ik aangetoond in Project Manga.

### Wat is ORM?
ORM = Object Relational Mapping. Het betekent dat je database-queries naar JavaScript objecten omzet, zodat je minder SQL code hoeft te schrijven en de logica duidelijker is.

### CRUD Operaties Geïmplementeerd

**1. CREATE - Nieuwe resource toevoegen**
- POST /api/anime → Nieuwe anime aanmaken
- POST /api/anime/:id/characters → Character toevoegen
- Validatie ingebouwd
- Response met created resource

**2. READ - Data ophalen**
- GET /api/anime → Alle anime ophalen
- GET /api/anime/:id → Specifieke anime
- GET /api/anime/:id/characters → Alle characters van anime
- GET /api/favorites → Mijn favoriete anime
- Efficient query van database

**3. UPDATE - Data wijzigen**
- PUT /api/anime/:id → Anime naam wijzigen
- PUT /api/anime/:id/characters/:charId → Character wijzigen
- Validatie op alle velden
- Conflict detection

**4. DELETE - Data verwijderen**
- DELETE /api/anime/:id → Anime verwijderen
- DELETE /api/anime/:id/characters/:charId → Character verwijderen
- Cascading deletes (verwijder anime = verwijder ook characters)
- Safe deletion (checken of bestaat)

### ORM Model Structuur

Ik heb Models gemaakt die **alleen database operaties** doen:
```
models/
  ├── animeModel.js
  ├── characterModel.js
  ├── userModel.js
  ├── ratingModel.js
  └── favoriteModel.js
```

Elk model heeft dezelfde structuur:
- `getAll()` - Read collection
- `getById(id)` - Read single
- `create(data)` - Create new
- `update(id, data)` - Update existing
- `delete(id)` - Delete resource

### Framework Integratie

Express.js routes gebruiken de Models:
```javascript
router.get('/:id', async (req, res) => {
  const anime = await Anime.getById(req.params.id);
  res.json({ data: anime });
});
```

**Voordeel:** Routes zijn schoon, Models zijn herbruikbaar, testen zijn makkelijk.

### Resources Beheerd

- **Anime** (5 endpoints) - Complete CRUD
- **Characters** (8 endpoints) - Nested CRUD
- **Users** (registration, login) - Auth CRUD
- **Ratings** (5 endpoints) - User ratings CRUD
- **Favorites** (3 endpoints) - Saved anime CRUD

**Total: 30+ endpoints met volledige CRUD.**

**Bewijslast:** Zie bewijslast (1), (2), (3), (4), (5), (6)
