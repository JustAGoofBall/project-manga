# 📊 Leeruitkomsten Analyse - Project Manga API

##  WAT JE AL HEBT BEREIKT

### **Oriëntatie op Frameworks** 

####  **Framework Documentatie & ORM**
- **Status**: VOLLEDIG BEREIKT
- **Bewijs**: 
  - Je gebruikt Express.js (backend framework)
  - MySQL2 als database driver (ORM-achtig)
  - Je hebt CRUD operaties geïmplementeerd (Create, Read, Update, Delete)
  - Je kunt resources beheren: anime en characters

####  **Structural Design Pattern (MVC)**
- **Status**: VOLLEDIG BEREIKT 
- **Bewijs**:
  - Model: `animeModel.js`, `characterModel.js` - database logica
  - View: JSON responses (REST API heeft geen traditionele views)
  - Controller: `animeController.js`, `characterController.js` - business logic
  - Duidelijke scheiding van verantwoordelijkheden
  - Je hebt zelfs documentatie: `MVC-STRUCTUUR.md`

### **Frameworks Gevorderd**

####  **Geautomatiseerde Testen** 
- **Status**: UITSTEKEND
- **Bewijs**:
  - 60 tests - allemaal geslaagd ✓
  - 3 test suites (anime, characters, errors)
  - Jest testing framework
  - Supertest voor API testing
  - Tests voor alle CRUD operaties
  - Tests voor error handling

####  **Scheiding van Verantwoordelijkheden**
- **Status**: EXCELLENT
- **Bewijs**:
  - Separate Models voor data access
  - Separate Controllers voor business logic
  - Separate Routes voor endpoints
  - Separate Validators voor input validatie
  - Separate Middleware voor logging en error handling

####  **Validatie & Foutafhandeling** 
- **Status**: GOED GEÏMPLEMENTEERD
- **Bewijs**:
  - Validators: `animeValidator.js`, `characterValidator.js`
  - Centralized error handler: `errorHandler.js`
  - Input validatie (naam lengte, vereiste velden)
  - HTTP status codes (400, 404, 409, etc.)
  - Custom error messages

####  **Business Logic & Relaties**
- **Status**: GEÏMPLEMENTEERD
- **Bewijs**:
  - Foreign key relatie: characters → anime (ON DELETE CASCADE)
  - Nested endpoints: `/api/anime/:animeId/characters`
  - Je haalt characters op bij anime (relaties)
  - Database schema met constraints

---

## ⚠️ WAT NOG ONTBREEKT

### 🔴 **KRITISCH - Nog niet geïmplementeerd:**

#### 1. **Authenticatie & Autorisatie** ❌
**Vereist voor**: Veilige code schrijven (leeruitkomst gevorderd)

**Wat je moet toevoegen**:
- [ ] **JWT (JSON Web Tokens)** voor authenticatie
- [ ] **Registratie endpoint**: `POST /api/auth/register`
- [ ] **Login endpoint**: `POST /api/auth/login`
- [ ] **Protected routes**: alleen ingelogde users mogen wijzigen
- [ ] **Middleware**: `authMiddleware.js` om tokens te verifiëren
- [ ] **Bcrypt**: voor wachtwoord hashing

**Waarom belangrijk**: Dit is cruciaal voor "veilige code" volgens je leeruitkomsten.

---

#### 2. **UI Framework** ⚠️
**Vereist voor**: Oriëntatie op UI-frameworks (leeruitkomst basis)

**Wat je moet toevoegen**:
- [ ] **Frontend** met bijvoorbeeld:
  - React.js (modern, veel gebruikt)
  - Vue.js (makkelijker te leren)
  - EJS/Pug (server-side rendering, simpeler)
- [ ] Pagina's:
  - Lijst van manga/anime
  - Detail pagina
  - Inloggen/registreren
  - Favorieten toevoegen
  - Ratings geven

**Waarom belangrijk**: Je leeruitkomst zegt "zowel backend- als UI-frameworks".

---

#### 3. **Manga-specifieke Features** ⚠️
**Vereist voor**: Je README zegt "ratings zien, favorieten maken"

**Database aanpassingen nodig**:
```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 10),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_anime (user_id, anime_id)
);

-- Favorites table  
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_favorite (user_id, anime_id)
);
```

**Nieuwe endpoints**:
- `POST /api/anime/:id/ratings` - Rating toevoegen
- `GET /api/anime/:id/ratings` - Ratings ophalen
- `POST /api/favorites` - Favoriet toevoegen
- `GET /api/favorites` - Mijn favorieten
- `DELETE /api/favorites/:id` - Favoriet verwijderen

---

## 🎯 STAPPENPLAN - Wat nu te doen?

### **FASE 1: Authenticatie & Autorisatie** (Week 1-2)
Deze is het belangrijkst voor je leeruitkomsten!

**Stap 1: Installeer dependencies**
```bash
npm install jsonwebtoken bcryptjs
```

**Stap 2: Maak users tabel** 
- Voeg toe aan `schema.sql`
- Run de migration

**Stap 3: Maak auth endpoints**
- `controllers/authController.js` - registratie & login logica
- `models/userModel.js` - user database operaties
- `routes/auth.js` - auth endpoints
- `middleware/authMiddleware.js` - JWT verificatie

**Stap 4: Protect bestaande routes**
- Alleen ingelogde users mogen POST/PUT/DELETE doen
- GET blijft publiek

**Stap 5: Tests voor auth**
- `tests/auth.test.js`

---

### **FASE 2: Ratings & Favorieten** (Week 2-3)

**Stap 1: Database schema**
- Ratings tabel
- Favorites tabel

**Stap 2: Models & Controllers**
- `models/ratingModel.js`
- `models/favoriteModel.js`
- `controllers/ratingController.js`
- `controllers/favoriteController.js`

**Stap 3: Routes**
- Routes voor ratings
- Routes voor favorites

**Stap 4: Tests**
- Test ratings CRUD
- Test favorites CRUD
- Test dat alleen eigen ratings kunnen worden gewijzigd

---

### **FASE 3: Frontend (UI Framework)** (Week 3-5)

**Optie A: React Frontend** (Meest modern)
```bash
npx create-react-app manga-frontend
cd manga-frontend
npm install axios react-router-dom
```

**Optie B: EJS Templates** (Makkelijker, server-side)
```bash
npm install ejs
```

**Pagina's om te maken**:
1. **Homepage** - Lijst van alle manga
2. **Detail pagina** - Specifieke manga met characters, ratings, reviews
3. **Login/Register** - Authenticatie formulieren
4. **Mijn Profiel** - Favorieten, mijn ratings
5. **Rating geven** - Formulier om rating achter te laten

---

### **FASE 4: Extra Features (Optioneel)** (Week 5+)

- [ ] **Search functionaliteit uitbreiden** - zoeken op genre, auteur
- [ ] **Genres toevoegen** - nieuwe tabel en relaties
- [ ] **Profiel foto's** - file upload
- [ ] **Comments** - discussies onder manga
- [ ] **Pagination** - bij veel manga
- [ ] **Sorting** - sorteer op rating, populariteit
- [ ] **Admin rol** - users kunnen manga toevoegen/verwijderen

---

## 📝 REFLECTIE & DOCUMENTATIE

Voor je leeruitkomst **"eigen leerproces evalueren"**, maak een reflectie document:

### Te documenteren:

1. **Wat heb je geleerd?**
   - MVC patroon begrijpen en toepassen
   - REST API design
   - Testing met Jest
   - Database relaties

2. **Wat ging goed?**
   - Goede code organisatie
   - Uitgebreide tests
   - Error handling

3. **Wat was moeilijk?**
   - [Vul dit zelf in]

4. **Wat zou je anders doen?**
   - [Vul dit zelf in]

5. **Technische keuzes uitleggen**
   - Waarom MVC?
   - Waarom Express?
   - Waarom MySQL?
   - Waarom deze validatie aanpak?

---

## 🎓 LEERUITKOMSTEN CHECKLIST

### **Oriëntatie Frameworks**  85%
- [x] Backend framework (Express.js)
- [x] Documentatie lezen en toepassen
- [x] Resource beheren met ORM
- [x] Structural design pattern (MVC)
- [ ] UI framework **(ONTBREEKT)**
- [ ] Keuzes uitleggen in document
- [ ] Reflectie schrijven

### **Frameworks Gevorderd**  70%
- [x] Geautomatiseerde testen (60 tests!)
- [x] Business logic & relaties
- [x] Scheiding van verantwoordelijkheden
- [x] Validatie & foutafhandeling
- [ ] **Authenticatie & autorisatie** **(KRITISCH)**
- [ ] Code review geven/ontvangen

---

## ADVIES

### **Prioriteit 1: Authenticatie**
Dit is het belangrijkste wat ontbreekt. Begin hier direct mee!

### **Prioriteit 2: UI Framework**
Nodig voor volledige leeruitkomst oriëntatie frameworks.

### **Prioriteit 3: Ratings & Favorieten**
Maakt je project compleet volgens je README beschrijving.

### **Prioriteit 4: Documentatie & Reflectie**
Essentieel voor beoordeling - leg uit waarom je bepaalde keuzes hebt gemaakt.

---

## BEGIN HIER

**Vandaag:**
1. Lees deze analyse grondig door
2. Kies: Begin met authenticatie OF UI framework
3. Vraag hulp als je niet weet hoe te beginnen

**Deze week:**
- Implementeer authenticatie (JWT + bcrypt)
- Schrijf tests voor auth
- Protect je routes

**Volgende week:**
- Ratings & Favorieten
- Begin met UI framework

---

## Heb je hulp nodig?

Zeg tegen mij:
- **"Help me met authenticatie"** - Ik maak de auth code voor je
- **"Help me met React frontend"** - Ik help je starten met UI
- **"Help me met ratings"** - Ik maak de rating functionaliteit
- **"Maak reflectie template"** - Ik maak een document voor je reflectie

Je bent al ver gekomen! Je hebt een solide basis. Nu gewoon de ontbrekende stukken toevoegen! 