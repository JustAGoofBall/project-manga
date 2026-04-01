# Leeruitkomst 3: API's Gebruiken

## Motivatie

Ik ben in staat om APIs te gebruiken als client. Dit betekent requests sturen naar endpoints, authenticatie hanteren, responses verwerken, en errors afhandelen.

### Client-Side API Usage

**Scenario: React Frontend Spreekt Express Backend**

Frontend code → HTTP Request → Express API → Database
Response ← Browser → Render

### Authentication Flow (JWT)

**Stap 1: Register New User**

```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Response:
// {
//   "success": true,
//   "user": { "id": 1, "username": "johndoe" },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// }

localStorage.setItem('token', data.token);
```

**Stap 2: Login**

```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

**Stap 3: Use Token for Protected Requests**

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/favorites/1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← Token hier!
  }
});

const result = await response.json();
```

### Fetching Data

**GET - Public Endpoint (No Token Needed)**

```javascript
// Fetch all anime
const response = await fetch('http://localhost:3000/api/anime');
const data = await response.json();

data.data.forEach(anime => {
  console.log(`${anime.name} (${anime.id})`);
});

// Output:
// Naruto (1)
// One Piece (2)
// Attack on Titan (3)
```

**GET - With Error Handling**

```javascript
try {
  const response = await fetch('http://localhost:3000/api/anime/999');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(data.data); // Anime details
  
} catch (error) {
  console.error('Fetch error:', error.message);
}
```

### POST - Create Resource

```javascript
const response = await fetch('http://localhost:3000/api/favorites/1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();

if (result.success) {
  console.log('Added to favorites!');
} else {
  console.error('Error:', result.message);
}
```

### PUT - Update Resource

```javascript
const response = await fetch('http://localhost:3000/api/auth/me', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    username: 'johndoe_updated'
  })
});

const result = await response.json();
console.log(result);
```

### DELETE - Remove Resource

```javascript
const response = await fetch('http://localhost:3000/api/favorites/1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result.message); // "Removed from favorites"
```

### React Context Integration

**AuthContext.jsx** - Manages API calls for authentication

```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  } else {
    setError(data.message);
  }
};
```

### React Pages Using API

**Pages/Favorites.jsx** - Uses API to fetch/manage favorites

```javascript
useEffect(() => {
  const fetchFavorites = async () => {
    const response = await fetch('/api/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    setFavorites(data.data);
  };

  fetchFavorites();
}, [token]);
```

### Error Handling

**Server Errors:**
```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!data.success) {
    console.error(data.message); // Use server message
  }
} catch (error) {
  console.error('Network error:', error.message);
}
```

**Common Scenarios:**
- 401 Unauthorized → Token expired, re-login
- 403 Forbidden → User doesn't have permission
- 404 Not Found → Resource doesn't exist
- 500 Internal Server Error → Server problem

### Key Learning

✅ Fetch API for HTTP requests
✅ JWT token handling (get, store, send)
✅ Request headers and formats
✅ Response parsing and validation
✅ Error handling and user feedback
✅ Protected vs public endpoints
✅ Form data vs JSON payloads

### Bewijslast

Zie bewijslast (1), (2), (3), (4)
