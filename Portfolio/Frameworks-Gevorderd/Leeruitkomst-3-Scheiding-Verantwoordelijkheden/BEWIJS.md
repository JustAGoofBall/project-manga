# 3️⃣ Leeruitkomst: Scheiding van Verantwoordelijkheden

**Wat heb ik bereikt:**  
Ik scheid verantwoordelijkheden consistent in code en snap het belang hiervan.

---

## 📋 Bewijsstuk 1: MVC Architectuur

### ✅ Bewijs
- Mappenstructuur screenshot
- Uitleg van MVC patroon
- Code voorbeelden van Model-Controller-Route

### 💬 Feedback Verwacht Van
- Docent Timo
- Medestudent Samir

### 📝 Mijn Uitleg

**Project Structuur:**
```
Project-Manga/
├── models/           ← Database logica
│   ├── animeModel.js
│   ├── characterModel.js
│   ├── userModel.js
│   ├── ratingModel.js
│   └── favoriteModel.js
│
├── controllers/      ← Business logica
│   ├── animeController.js
│   ├── characterController.js
│   ├── authController.js
│   ├── ratingController.js
│   └── favoriteController.js
│
├── routes/          ← URL endpoints
│   ├── anime.js
│   ├── characters.js
│   ├── auth.js
│   ├── ratings.js
│   └── favorites.js
│
├── middleware/      ← Cross-cutting concerns
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── logger.js
│
├── validators/      ← Input validatie
│   ├── animeValidator.js
│   └── authValidator.js
│
└── config/         ← Configuratie
    ├── db.js
    └── data.js
```

**Voordelen van deze structuur:**
- ✅ **Models:** Alleen database queries (geen HTTP code)
- ✅ **Controllers:** Alleen business logica (geen SQL)
- ✅ **Routes:** Alleen URL mapping (geen logica)
- ✅ **Middleware:** Gecentreerd (logging, auth, errors)
- ✅ **Validators:** Herbruikbaar (input checks)

---

## 📋 Bewijsstuk 2: Code Voorbeelden

### ✅ Bewijs
- Gedetailleerde code met commentaar
- Diagram van data flow
- Voor/na refactoring

### 💬 Feedback Verwacht Van
- Docent Timo

### 📝 Mijn Uitleg

**VOORBEELD 1: Anime CRUD - Goed gescheiden**

```javascript
// ========== ROUTE ========== (routes/anime.js)
// ✅ Alleen URL mapping
router.get('/:id', authMiddleware, animeController.getAnimeById);
router.post('/', authMiddleware, animeController.createAnime);
```

```javascript
// ========== CONTROLLER ========== (controllers/animeController.js)
// ✅ Alleen business logica
exports.getAnimeById = async (req, res, next) => {
  try {
    const anime = await Anime.getById(req.params.id);
    if (!anime) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: anime });
  } catch (error) {
    next(error);
  }
};
```

```javascript
// ========== MODEL ========== (models/animeModel.js)
// ✅ Alleen database queries
static async getById(id) {
  const [anime] = await db.query(
    'SELECT * FROM anime WHERE id = ?',
    [id]
  );
  return anime[0] || null;
}
```

---

## 📋 Bewijsstuk 3: Refactoring Proces

### ✅ Bewijs
- Voor/na screenshots van code
- Git commit messages
- Documenting van verbetering

### 💬 Feedback Verwacht Van
- Docent Timo

### 📝 Mijn Uitleg

**REFACTORING: Error Handler Middleware**

**VOOR:** Error handling verspreid
**NA:** Centralized error handling

Zie /middleware/errorHandler.js en hoe alle controllers deze gebruiken.

---

## 🎯 Feedback Ontvangen

### Van Timo:
[Nog in te vullen na feedback ontvangen]

### Van Samir:
[Nog in te vullen na feedback ontvangen]

---

## 🎯 Checklist Leeruitkomst 3

- [ ] Mappenstructuur screenshot
- [ ] MVC diagram
- [ ] Code voorbeelden met commentaar
- [ ] Refactoring voorbeeld
- [ ] Feedback van Timo ontvangen
- [ ] Feedback van Samir ontvangen

**Status:** ⏳ In Progress

---

## 💡 Reflectie

Wat heb ik geleerd?
- Scheiding van concerns = beter onderhoudbare code
- DRY: Don't Repeat Yourself
- Middleware is krachtig voor centralizatie

Wat was moeilijk?
- [Vul in na feedback]

Hoe verbeter ik dit?
- [Vul in na feedback]
