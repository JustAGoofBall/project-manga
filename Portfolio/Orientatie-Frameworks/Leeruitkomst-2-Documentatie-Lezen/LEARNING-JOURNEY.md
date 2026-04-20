# 📚 Documentation Learning Journey

## Express.js Documentatie Leerproces

### 📖 1. Documentatie: Routing

**Link:** https://expressjs.com/en/starter/basic-routing.html

**Wat Ik Leerde:**
```javascript
// Basic routing pattern
app.METHOD(PATH, HANDLER)

app.get('/api/anime', (req, res) => {
  res.json({ message: 'Get all anime' });
});

app.post('/api/anime', (req, res) => {
  // Create anime
});
```

**Hoe Ik Dit Gebruikte:**
- [routes/anime.js](../../../routes/anime.js) - All 6 routes implemented
- [routes/characters.js](../../../routes/characters.js) - 5 routes
- [routes/auth.js](../../../routes/auth.js) - 4 auth routes

---

### 📖 2. Documentatie: Middleware

**Link:** https://expressjs.com/en/guide/using-middleware.html

**Wat Ik Leerde:**
```javascript
// Middleware patterns
app.use(middleware)           // Applied to all routes
app.use('/api', middleware)   // Applied to /api routes only
app.get('/path', middleware, handler)  // Applied to specific route
```

**Hoe Ik Dit Gebruikte:**
- [middleware/logger.js](../../../middleware/logger.js) - Request logging
- [middleware/authMiddleware.js](../../../middleware/authMiddleware.js) - JWT verification
- [middleware/errorHandler.js](../../../middleware/errorHandler.js) - Error handling
- Rate limiting in [index.js](../../../index.js)

---

### 📖 3. Documentatie: Error Handling

**Link:** https://expressjs.com/en/guide/error-handling.html

**Wat Ik Leerde:**
```javascript
// Error handling middleware pattern
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message
  });
});
```

**Hoe Ik Dit Gebruikte:**
- [middleware/errorHandler.js](../../../middleware/errorHandler.js) - Centralized error handling
- Alle controllers hebben try/catch blocks
- Consistent error response format

---

## React Documentatie Leerproces

### 📖 4. Documentatie: Components & JSX

**Link:** https://react.dev/learn

**Wat Ik Leerde:**
```jsx
// Functional component with JSX
function AnimeCard({ anime }) {
  return (
    <div>
      <h2>{anime.name}</h2>
      <p>{anime.characters.length} characters</p>
    </div>
  );
}
```

**Hoe Ik Dit Gebruikte:**
- [frontend/src/components/](../../../frontend/src/components/) - Reusable components
- Props-based data passing
- Component composition

---

### 📖 5. Documentatie: Hooks (useState, useEffect)

**Link:** https://react.dev/reference/react/hooks

**Wat Ik Leerde:**
```jsx
// useState for state management
const [anime, setAnime] = useState([]);

// useEffect for side effects
useEffect(() => {
  fetchAnime();
}, []);  // Dependency array

// Custom hooks for reusable logic
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData);
  }, [url]);
  return data;
}
```

**Hoe Ik Dit Gebruikte:**
- State management in components
- API calls via useEffect
- Loading/error state handling
- Custom hooks for API logic

---

### 📖 6. Documentatie: React Router

**Link:** https://reactrouter.com/

**Wat Ik Leerde:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/anime/:id" element={<AnimeDetail />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</BrowserRouter>
```

**Hoe Ik Dit Gebruikte:**
- [frontend/src/App.jsx](../../../frontend/src/App.jsx) - Main routing
- Navigation between pages
- Dynamic routes for anime detail pages

---

## MySQL2 Documentatie Process

### 📖 7. Documentatie: Connection Pool & Queries

**Link:** https://github.com/sidorares/node-mysql2

**Wat Ik Leerde:**
```javascript
// Connection pooling
const pool = mysql.createPool({...});

// Query execution
const [rows] = await pool.query('SELECT * FROM anime');

// Parameterized queries (prevent SQL injection)
const [rows] = await pool.query(
  'SELECT * FROM anime WHERE id = ?',
  [id]
);
```

**Hoe Ik Dit Gebruikte:**
- [config/db.js](../../../config/db.js) - Database connection setup
- [models/animeModel.js](../../../models/animeModel.js) - Parameterized queries
- All models use Connection pool

---

## 📊 Documentatie Bronnen Samenvatting

| Framework | Documentatie | Conciseness | Helpfulness | Examples |
|---|---|---|---|---|
| **Express.js** | https://expressjs.com/ | 🟢 Clear | 🟢 Good | 🟢 Many |
| **React** | https://react.dev/ | 🟢 Clear | 🟢 Excellent | 🟢 Interactive |
| **MySQL2** | GitHub docs | 🟡 Brief | 🟢 Good | 🟡 Few |
| **React Router** | https://reactrouter.com/ | 🟢 Clear | 🟢 Good | 🟢 Many |

---

## 💡 Eigen Gemaakte Samenvattingen

### Express.js Samenvatting
```markdown
# Express.js Key Concepts

## Structuur
- Routes: Definiëren endpoints (GET, POST, PUT, DELETE)
- Controllers: Business logic uitvoering
- Middleware: Per-request processing
- Error Handler: Centralized error management

## Routing Pattern
app.METHOD(path, middleware, handler)

## Response Formats
- res.json() - Send JSON
- res.status(200) - HTTP status
- res.send() - Send text/HTML
```

### React Samenvatting
```markdown
# React Key Concepts

## Rendering
- Functional components
- JSX syntax
- Props for communication
- Keys for lists

## State & Effects
- useState for component state
- useEffect for side effects
- Dependency arrays control re-renders
- Cleanup functions for teardown

## Styling
- CSS Modules
- Inline styles
- Tailwind CSS
```

---

## ✅ Gevolgtrekking

Ik heb actief :
1. ✅ Officiele documentation gelezen
2. ✅ Concepten begrepen
3. ✅ Code geexperimenteerd
4. ✅ Eigen samenvattingen gemaakt
5. ✅ In project geïmplementeerd

Dit proces herhaalde zich voor alle 3 frameworks/libraries gebruiked in dit project!
