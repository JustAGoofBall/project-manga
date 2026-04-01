# 2️⃣ Leeruitkomst: Documentatie van Framework Lezen & Eigen Maken

**Wat heb ik bereikt:**  
Ik ben in staat om (met begeleiding) de documentatie van een framework te lezen en deze stof eigen te maken.

---

## 📋 Bewijsstuk 1: Express.js Documentatie Gelezen & Toegepast

### ✅ Bewijs
- Express official documentation consulted
- Patterns implemented from docs
- Best practices applied
- Code follows Express conventions

### 📝 Mijn Uitleg

**Express Concepts Bestudeerd:**

**1. Middleware Pattern** (From Express docs)

**Wat is middleware?**
- Functions that run in request pipeline
- Can modify request/response
- Can end request or pass to next

**Hoe ik het implementeerde:**

```javascript
// middleware/logger.js - Geleerd van Express docs
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next(); // Pass to next middleware
});

// middleware/authMiddleware.js
app.use('/api/protected', (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'No token' });
  }
  next(); // Proceed if authorized
});

// middleware/errorHandler.js - Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});
```

**2. Routing Pattern** (From Express docs)

**Express Router:**
Express documentation teaches to organize routes with Router

```javascript
// routes/anime.js - Express best practice
const router = express.Router();

// GET /api/anime
router.get('/', (req, res) => {
  // Handler
});

// POST /api/anime (protected)
router.post('/', authMiddleware, (req, res) => {
  // Handler
});

module.exports = router;

// In index.js
app.use('/api/anime', require('./routes/anime'));
```

**3. Status Codes** (From REST best practices)

```javascript
// Express uses standard HTTP status codes
200 - OK (successful GET)
201 - Created (successful POST)
400 - Bad Request (validation error)
401 - Unauthorized (no token)
403 - Forbidden (token but no permission)
404 - Not Found (resource doesn't exist)
500 - Server Error
```

---

## 📋 Bewijsstuk 2: React Documentatie Gelezen & Eigen Gemaakt

### ✅ Bewijs
- React official docs studied
- Hooks implemented correctly
- Component patterns applied
- State management configured

### 📝 Mijn Uitleg

**React Concepts Bestudeerd:**

**1. Components & Hooks** (From React docs)

**Functional Components met Hooks:**

```javascript
// pages/Home.jsx - React hooks pattern
import { useState, useEffect } from 'react';

export default function Home() {
  // useState - Manage component state
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // useEffect - Side effects (API calls)
  useEffect(() => {
    fetch('/api/anime')
      .then(res => res.json())
      .then(data => {
        setAnime(data.data);
        setLoading(false);
      });
  }, []); // Empty dependency = runs once on mount
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {anime.map(a => (
        <div key={a.id}>{a.name}</div>
      ))}
    </div>
  );
}
```

**2. React Router** (From React Router docs)

```javascript
// App.jsx - React Router setup
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/favorites" element={
          <PrivateRoute><Favorites /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

**3. Context API** (From React docs)

```javascript
// context/AuthContext.jsx - State management
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
}

// Using context in components
import { useContext } from 'react';

function MyComponent() {
  const { user, token } = useContext(AuthContext);
  return <div>Hello {user?.username}</div>;
}
```

---

## 📋 Bewijsstuk 3: Documentatie Learning Path

### ✅ Bewijs
- Systematic approach to learning
- Concepts understood progressively
- Applied in real project

### 📝 Mijn Uitleg

**Stap-voor-stap Leerproces:**

**Maand 1-2: Basics**
1. ✅ Express.js getting started
2. ✅ Basic routes & responses
3. ✅ Request/response cycle
4. ✅ HTTP methods (GET, POST, PUT, DELETE)

**Maand 2-3: Intermediate**
1. ✅ Middleware in depth
2. ✅ Error handling patterns
3. ✅ Database integration
4. ✅ MVC architecture

**Maand 3-4: Advanced**
1. ✅ Authentication (JWT)
2. ✅ Authorization patterns
3. ✅ Testing (Jest/Supertest)
4. ✅ Security best practices

**Frontend (Parallel):**
1. ✅ React basics (JSX, components)
2. ✅ Hooks (useState, useEffect)
3. ✅ Routing (React Router)
4. ✅ Context API (state management)
5. ✅ API integration (fetch)
6. ✅ Protected routes

---

## 📋 Bewijsstuk 4: Documentatie Toegepast in Code

### ✅ Bewijs
- Every major feature has pattern from framework docs
- Code follows best practices
- Professional structure maintained

### 📝 Mijn Uitleg

**Express.js Patterns:**

| Concept | From Docs | My Implementation |
|---------|-----------|-------------------|
| Routing | Router class | `/routes/*.js` files |
| Middleware | Pipeline pattern | auth, logger, error handler |
| Status codes | HTTP standards | 200, 201, 400, 401, 404 |
| Error handling | Try-catch + middleware | errorHandler.js |
| Rate limiting | express-rate-limit | `/api` and `/api/auth` limiters |

**React Patterns:**

| Concept | From Docs | My Implementation |
|---------|-----------|-------------------|
| Hooks | useState, useEffect | All pages use hooks |
| Routing | React Router | App.jsx routing setup |
| Components | Reusable functions | Navbar, PrivateRoute |
| State | Context API | AuthContext for user |
| Props | Component communication | Passing data down |

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**Wat heb ik geleerd?**
- Documentation is most valuable resource
- Real projects reinforce learning
- Trial & error helps understanding
- Best practices matter for maintainability

**Hoe ik dit deed:**
- Read docs section by section
- Tried concepts in small examples first
- Applied to main project
- Asked questions when stuck

**Bevindingen:**
- Express docs are very clear
- React docs have great tutorials
- MDN helped with JavaScript concepts
- Stack Overflow for specific problems

**Verbetering:**
- Could have read docs more thoroughly first
- Should have taken better notes
- Could have made more small test projects

**Result:**
- Professional-grade application
- Follows framework conventions
- Maintainable and scalable
- Industry-standard practices applied
