# 1️⃣ Leeruitkomst: Oriëntatie op Zowel Backend- als UI-Frameworks

**Wat heb ik bereikt:**  
Ik heb me georiënteerd op zowel backend- als UI-frameworks.

---

## 📋 Bewijsstuk 1: Backend Framework - Express.js

### ✅ Bewijs
- Express.js framework gekozen en toegepast
- REST API met 30+ endpoints
- Professional middleware structuur
- Production-ready security

### 📝 Mijn Uitleg

**Express.js Keuze:**

Express is een **lightweight Node.js framework** perfect voor REST APIs:
- ✅ Minimaal maar krachtig
- ✅ Groot community/resources
- ✅ Perfect voor CRUD operaties
- ✅ Goed te testen

**Hoe ik Express gebrui:**

```javascript
// index.js - Entry point
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(logger);           // Custom logging
app.use('/api', generalLimiter);  // Rate limiting

// Routes
app.use('/api/anime', require('./routes/anime'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/favorites', require('./routes/favorites'));

app.listen(3000, () => console.log('API running'));
```

**Express Features Gebruikt:**
- ✅ Route organization (`routes/`)
- ✅ Middleware pipeline (logging, auth, error handling)
- ✅ Request/response handling
- ✅ Status codes & JSON responses
- ✅ Error handling centralized

**Backend Endpoints (30+):**
- Anime CRUD (5 endpoints)
- Characters CRUD (8 endpoints)
- Authentication (5 endpoints)
- Ratings (5 endpoints)
- Favorites (3 endpoints)
- Admin (3 endpoints)
- Search (1 endpoint)

---

## 📋 Bewijsstuk 2: UI Framework - React.js

### ✅ Bewijs
- React.js frontend gebouwd
- 6+ components geïmplementeerd
- 6 pagina's met routing
- State management met Context API

### 📝 Mijn Uitleg

**React Keuze:**

React is een **component-based UI framework**:
- ✅ Reusable components
- ✅ Virtual DOM (performance)
- ✅ Excellent for SPA (Single Page Apps)
- ✅ Context API for state management

**Frontend Architectuur:**

```
frontend/
├── src/
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation bar
│   │   └── PrivateRoute.jsx # Protected routes
│   ├── pages/
│   │   ├── Home.jsx         # Anime listing
│   │   ├── AnimeDetail.jsx  # Detail + ratings
│   │   ├── Login.jsx        # Authentication
│   │   ├── Register.jsx     # Create account
│   │   ├── Favorites.jsx    # User wishlist
│   │   └── AdminPanel.jsx   # Admin features
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state
│   └── styles/
│       ├── Home.css
│       ├── Auth.css
│       └── utilities.css
```

**React Features Gebruikt:**
- ✅ Components (functional + hooks)
- ✅ React Router for navigation
- ✅ Context API for state
- ✅ useState/useEffect hooks
- ✅ Protected routes (PrivateRoute)
- ✅ API integration (fetch/axios)

**Frontend Pages:**
1. **Home** - Anime listing with search
2. **AnimeDetail** - Characters, ratings, favorites
3. **Login** - User authentication
4. **Register** - Create account
5. **Favorites** - My saved anime
6. **AdminPanel** - User management (bonus)

---

## 📋 Bewijsstuk 3: Framework Documentatie & Resources

### ✅ Bewijs
- Express.js docs consulted
- React.js docs applied
- Official tutorials followed
- Best practices implemented

### 📝 Mijn Uitleg

**Express.js Resources Gebruikt:**

1. **Middleware Concepts**
   - Express middleware documentation
   - Logger implementation (custom)
   - Error handler pattern
   - CORS & rate limiting

2. **Routing Patterns**
   ```javascript
   // Nested resources (Express pattern)
   router.get('/anime/:animeId/characters', ...)
   router.post('/anime/:animeId/characters', ...)
   ```

3. **Authentication**
   - JWT implementation
   - Middleware verification
   - Protected route pattern

**React Resources Gebruikt:**

1. **Hooks & State**
   - useState for component state
   - useEffect for side effects
   - useContext for global state

2. **Routing**
   - React Router v6
   - Nested routes
   - Protected routes (PrivateRoute)

3. **API Integration**
   ```javascript
   useEffect(() => {
     fetch('/api/anime')
       .then(res => res.json())
       .then(data => setAnime(data.data))
   }, [])
   ```

**Best Practices Applied:**
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ DRY (Don't Repeat Yourself)
- ✅ Error handling
- ✅ Security (JWT, CORS, validation)
- ✅ Performance (lazy loading, caching)

---

## 📋 Bewijsstuk 4: Bijkomende Frameworks & Libraries

### ✅ Bewijs
- Multiple supporting frameworks
- Proper dependency management
- Industry-standard tools

### 📝 Mijn Uitleg

**Backend Stack:**
```json
{
  "express": "^4.18.0",           // Web framework
  "jsonwebtoken": "^9.0.0",       // JWT authentication
  "bcryptjs": "^2.4.0",           // Password hashing
  "cors": "^2.8.5",               // Cross-origin requests
  "express-rate-limit": "^6.7.0", // Rate limiting
  "dotenv": "^16.0.3",            // Environment variables
  "jest": "^29.0.0",              // Testing framework
  "supertest": "^6.3.0",          // API testing
  "better-sqlite3": "^8.6.0"      // Database (SQLite)
}
```

**Frontend Stack:**
```json
{
  "react": "^18.0.0",             // UI framework
  "react-router-dom": "^6.8.0",   // Routing
  "vite": "^4.3.0",               // Build tool
  "@vitejs/plugin-react": "^4.0"  // Vite React plugin
}
```

**Supporting Technologies:**
- ✅ Jest + Supertest (testing)
- ✅ better-sqlite3 (database)
- ✅ Bcryptjs (security)
- ✅ JWT (authentication)
- ✅ CORS (cross-origin)

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**Wat heb ik geleerd?**
- Express.js is perfect voor REST APIs
- React makes UI development efficient  
- Frameworks provide structure & best practices
- Choosing right tools matters for scalability

**Waarom deze keuze?**
- Express: Lightweight, popular, well-documented
- React: Component-based, performant, industry-standard
- Together: Clean separation frontend/backend

**Technische Details:**
- Backend on port 3000 (Express default)
- Frontend on port 5173 (Vite development server)
- API proxy configured in `vite.config.js`
- Communication via REST endpoints with JSON

**Resultaat:**
- Professional full-stack application
- 30+ working endpoints
- Responsive UI with authentication
- Test coverage & error handling
- Production-ready code
