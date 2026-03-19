# 🔐 Authenticatie & Autorisatie Gids

## ✅ WAT IS GEÏMPLEMENTEERD

Je API heeft nu **volledige JWT-based authenticatie** met de volgende features:

### 🎯 Features
- ✅ **User registratie** met bcrypt password hashing
- ✅ **User login** met JWT token generatie
- ✅ **Protected routes** - alleen ingelogde users kunnen wijzigen
- ✅ **Profile management** - users kunnen hun profiel beheren
- ✅ **Input validatie** - alle input wordt gevalideerd
- ✅ **Error handling** - goede error messages
- ✅ **Tests** - 20+ tests voor authenticatie

---

## 📋 DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Ratings Table (klaar voor gebruik)
```sql
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
```

### Favorites Table (klaar voor gebruik)
```sql
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

---

## 🚀 HOE TE GEBRUIKEN

### 1️⃣ **Database Opnieuw Aanmaken**

Het schema is bijgewerkt met users, ratings en favorites tabellen. 

**Optie A: Via MySQL Command Line**
```bash
mysql -u root -p < schema.sql
```

**Optie B: Via MySQL Workbench**
1. Open `schema.sql` in MySQL Workbench
2. Run het hele script

**⚠️ LET OP**: Dit verwijdert alle bestaande data!

### 2️⃣ **Start de Server**
```bash
npm start
```

### 3️⃣ **Test de Auth Endpoints**

#### **Registreer een User**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2026-03-09T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**💾 BEWAAR DE TOKEN!** Je hebt deze nodig voor protected routes.

---

#### **Login**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### **Get Profile (Protected)**
```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2026-03-09T...",
    "updated_at": "2026-03-09T..."
  }
}
```

---

#### **Update Profile (Protected)**
```bash
PUT http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

---

#### **Create Anime (Now Protected!)**
```bash
POST http://localhost:3000/api/anime
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Naruto"
}
```

**Without Token:**
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

---

## 🧪 RUN TESTS

```bash
npm test
```

Je zou nu **80+ tests** moeten hebben, inclusief:
- ✅ Auth tests (registratie, login, profile)
- ✅ Protected routes tests
- ✅ Anime CRUD tests
- ✅ Character CRUD tests
- ✅ Error handling tests

---

## 🔒 BEVEILIGING

### **Wat is Geïmplementeerd**

#### **1. Password Hashing (bcrypt)**
- Passwords worden **NOOIT** plain text opgeslagen
- Bcrypt gebruikt salt rounds (10) voor extra beveiliging
- Zelfs als database gelekt wordt, zijn passwords veilig

```javascript
// In userModel.js
const saltRounds = 10;
const password_hash = await bcrypt.hash(password, saltRounds);
```

#### **2. JWT Tokens**
- Token bevat user info (id, username, email)
- Token expireert na 7 dagen
- Token wordt getekend met secret key

```javascript
// In authController.js
const token = jwt.sign(
  { id: user.id, username: user.username, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

#### **3. Input Validatie**
- Email format validatie
- Username length validatie (3-50 chars)
- Password strength validatie (min 6 chars)
- SQL injection preventie (prepared statements)

#### **4. Authorization**
- Alleen ingelogde users kunnen POST/PUT/DELETE doen
- GET requests blijven publiek (iedereen kan lezen)
- Users kunnen alleen eigen profiel wijzigen

---

## 📐 ARCHITECTUUR

### **Bestanden Structuur**

```
models/
  └── userModel.js           # User database operations

controllers/
  └── authController.js      # Auth business logic

middleware/
  └── authMiddleware.js      # JWT verification

validators/
  └── authValidator.js       # Input validation

routes/
  └── auth.js               # Auth endpoints

tests/
  └── auth.test.js          # Auth tests
```

### **Request Flow**

```
1. User → POST /api/auth/login
2. Router → authController.login()
3. Validator → validateLogin() ✓
4. Model → User.getByEmail()
5. Model → User.verifyPassword() ✓
6. Controller → Generate JWT token
7. Response → { user, token }
```

**Protected Route Flow:**

```
1. User → POST /api/anime (with Bearer token)
2. Middleware → authMiddleware() → Verify JWT ✓
3. Middleware → Attach user to req.user
4. Router → animeController.createAnime()
5. Controller → Can access req.user.id
6. Response → Created anime
```

---

## ✅ LEERUITKOMSTEN CHECKLIST

### **Authenticatie & Autorisatie** ✅
- [x] JWT tokens voor authenticatie
- [x] Bcrypt voor password hashing
- [x] Protected routes met middleware
- [x] Authorization checks
- [x] Token expiration
- [x] Secure password storage

### **Validatie** ✅
- [x] Email validatie
- [x] Username validatie
- [x] Password strength validatie
- [x] Input sanitization
- [x] Error messages

### **Foutafhandeling** ✅
- [x] 400 - Bad Request (invalid input)
- [x] 401 - Unauthorized (no/invalid token)
- [x] 404 - Not Found
- [x] 409 - Conflict (duplicate email/username)
- [x] Meaningful error messages

### **Testen** ✅
- [x] Registration tests
- [x] Login tests
- [x] Protected routes tests
- [x] Validation tests
- [x] Error handling tests
- [x] Token verification tests

### **Code Kwaliteit** ✅
- [x] MVC architectuur
- [x] Separation of concerns
- [x] DRY (Don't Repeat Yourself)
- [x] Clear naming conventions
- [x] Comments en documentatie

---

## 🎯 VOLGENDE STAPPEN

### **1. Ratings Functionaliteit**
Je database is al klaar! Nu alleen nog:
- `models/ratingModel.js`
- `controllers/ratingController.js`
- `routes/ratings.js`
- Tests

### **2. Favorites Functionaliteit**
Ook klaar in database:
- `models/favoriteModel.js`
- `controllers/favoriteController.js`
- `routes/favorites.js`
- Tests

### **3. UI Framework**
Nu je authenticatie hebt, kun je een frontend maken:
- React/Vue/EJS
- Login/register formulieren
- Protected pages
- Token opslaan (localStorage/cookies)

---

## 🐛 TROUBLESHOOTING

### **"No authorization token provided"**
- Check of je `Authorization` header hebt toegevoegd
- Format moet zijn: `Bearer <token>`
- Let op de spatie na "Bearer"

### **"Invalid token"**
- Token is incorrect of corrupt
- Login opnieuw om nieuwe token te krijgen

### **"Token expired"**
- Je token is ouder dan 7 dagen
- Login opnieuw

### **Database errors**
- Check of je de nieuwe schema hebt gerund
- Controleer of users tabel bestaat
- Check database connectie in .env

---

## 💡 TIPS VOOR PRESENTATIE

Voor je eindproject beoordeling kun je laten zien:

1. **Authenticatie werkt**: Registratie → Login → Token ontvangen
2. **Authorization werkt**: POST zonder token = error, met token = success
3. **Beveiliging**: Passwords gehashed in database
4. **Validatie**: Foute input = duidelijke error messages
5. **Tests**: Run `npm test` en laat zien dat alles slaagt
6. **Code kwaliteit**: Goede structuur, comments, separation of concerns

---

## ❓ VRAGEN?

Je hebt nu een **volledig werkend authenticatie systeem**! 🎉

**Wil je verder?**
- "Help me met ratings implementeren"
- "Help me met favorites implementeren"
- "Help me met React frontend"
