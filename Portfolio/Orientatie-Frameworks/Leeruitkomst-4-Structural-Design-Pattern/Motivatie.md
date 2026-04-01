# Leeruitkomst 4: Structural Design Pattern (MVC)

## Motivatie

Ik ben in staat om software te schrijven middels een structural design pattern (MVC) die voldoet aan de geldende richtlijnen. MVC = Model-View-Controller, de meest gebruikte architectuurpattern in de industrie.

### Waarom MVC?

MVC scheidt je code in drie lagen:
- **Model** = Database operaties (diepste laag)
- **Controller** = Business logica (middenlaag)
- **View** = Presentatie (frontend, JSON, UI)

**Voordeel:** Schoon, testbaar, onderhoudbaar, schaalbaar.

### MVC In Project Manga

**MODEL-Laag (Database)**
```
/models/
  ├── animeModel.js       (anime database queries)
  ├── characterModel.js   (character database queries)
  ├── userModel.js        (user database queries)
  ├── ratingModel.js      (rating database queries)
  └── favoriteModel.js    (favorite database queries)
```

**Regel:** Model bevat ALLEEN database queries. Geen HTTP, geen business logica.

**CONTROLLER-Laag (Business Logic)**
```
/controllers/
  ├── animeController.js      (anime logica: validatie, autorisatie)
  ├── characterController.js  (character logica)
  ├── authController.js       (authentication flow)
  ├── ratingController.js     (rating logica)
  └── favoriteController.js   (favorite logica)
```

**Regel:** Controller roept Models aan, doet validatie, stuurt responses.

**VIEW-Laag (Presentatie)**
```
/routes/ + /frontend/
  ├── routes/anime.js    (API endpoints = JSON response)
  ├── routes/auth.js     (authentication endpoints)
  └── frontend/src/pages/ (React components = HTML/UI)
```

**Regel:** View krijgt data van Controller, toont aan gebruiker.

### Request Flow (MVC)

```
1. [User] → POST /api/anime {name: "Naruto"}
              ↓
2. [Router:routes/anime.js] → Route maps to controller
              ↓
3. [Controller] → Validate input, check auth
              ↓
4. [Model] → Insert into database
              ↓
5. [Response] ← {"id": 1, "name": "Naruto"}
```

**Elke laag onafhankelijk testen:**
- Model: `animeModel.test.js` (geen network)
- Controller: Mock model, test logica
- Routes: Full integration test

### Voordelen van dit Pattern

- ✅ **Testbaarheid:** Elk deel apart testen
- ✅ **Onderhoudbaarheid:** Weet waar to zoeken  
- ✅ **Schaalbaarheid:** Makkelijk features toevoegen
- ✅ **Teamwork:** Developers kunnen parallel werken
- ✅ **Professionaliteit:** Industry standard

### MVC Richtlijnen Gevolgd

- ✅ Separation of concerns strict maintained
- ✅ No logic leakage (model vrij van HTTP code)
- ✅ Clear file organization by responsibility
- ✅ Middleware for cross-cutting concerns (logging, auth, errors)
- ✅ Consistent patterns across all resources

**Bewijslast:** Zie bewijslast (1), (2), (3), (4), (5)
