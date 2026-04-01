# 3️⃣ Leeruitkomst: API's Gebruiken

**Wat heb ik bereikt:**  
De student is in staat API's te gebruiken.

---

## 📋 Bewijsstuk 1: Using Endpoints (Frontend/Client)

### ✅ Bewijs
- HTTP requests naar API
- Authentication (JWT tokens)
- Response parsing
- Error handling client-side

### 📝 Mijn Uitleg

**Voorbeeld 1: Registratie & Login (Getting JWT Token)**

**Register Request:**
```javascript
// POST request to create user
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
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
//   "user": { "id": 1, "username": "johndoe", "email": "john@example.com" },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// }

// Store token for later use
localStorage.setItem('token', data.token);
```

**Login Request:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

**Voorbeeld 2: Using Protected Endpoint (With Token)**

**Add Favorite Request:**
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/favorites/1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← JWT token here!
  }
});

const data = await response.json();
// Response:
// {
//   "success": true,
//   "message": "Anime added to favorites"
// }
```

**Voorbeeld 3: Get Data**

**Fetch All Anime:**
```javascript
const response = await fetch('http://localhost:3000/api/anime');
const data = await response.json();

data.data.forEach(anime => {
  console.log(`${anime.name} (${anime.id})`);
});
```

**Voorbeeld 4: Error Handling**

```javascript
const token = localStorage.getItem('token');

try {
  const response = await fetch('http://localhost:3000/api/anime/999', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    // Handle error
    const error = await response.json();
    console.error(`Error: ${error.message}`);
    return;
  }

  const data = await response.json();
  console.log(data.data);
} catch (error) {
  console.error('Network error:', error);
}
```

---

## 📋 Bewijsstuk 2: Using External API (Consuming Third-Party API)

### ✅ Bewijs
- Calling external APIs
- Parsing responses
- Handling API errors
- Rate limiting / API keys

### 📝 Mijn Uitleg

**Voorbeeld: Using My Own API from Various Clients**

**Via Browser/Postman:**
```
GET http://localhost:3000/api/anime
Authorization: Bearer <token>
```

**Via Python:**
```python
import requests

# Get all anime
response = requests.get('http://localhost:3000/api/anime')
anime_list = response.json()['data']

# Add favorite
headers = {
    'Authorization': f'Bearer {token}'
}
response = requests.post(
    'http://localhost:3000/api/favorites/1',
    headers=headers
)
```

**Via JavaScript (Axios):**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get anime
const { data } = await api.get('/anime');

// Add rating
await api.post(`/anime/1/ratings`, {
  rating: 8,
  review: 'Amazing anime!'
});
```

---

## 📋 Bewijsstuk 3: API Documentation & Testing

### ✅ Bewijs
- Endpoint documentation
- Postman/REST client examples
- Error cases

### 📝 Mijn Uitleg

**API Documentation** (Root endpoint: `GET /`)

```
GET / -> Welcome message with all endpoints listed

Endpoints:
- GET /api/anime
- POST /api/anime (admin)
- GET /api/anime/:id
- PUT /api/anime/:id (admin)
- DELETE /api/anime/:id (admin)
- GET /api/anime/:id/characters
- POST /api/anime/:id/characters (admin)
- etc...
```

**Testing Endpoints:**

```
✅ Public endpoint:
GET http://localhost:3000/api/anime
Response: 200 OK with array of anime

❌ Private endpoint without token:
GET http://localhost:3000/api/favorites
Response: 401 Unauthorized

✅ Private endpoint with token:
GET http://localhost:3000/api/favorites
Authorization: Bearer <token>
Response: 200 OK with user's favorites
```

---

## 🎯 Feedback Ontvangen

### Van Docent/Medestudent:
[Nog in te vullen na feedback ontvangen]

---

## 💡 Reflectie

**Wat heb ik geleerd?**
- Hoe APIs werkelijk gebruikt worden
- JWT authentication flow
- Request/response cycle begrijpen
- Error handling from client side
- Integratie met frontend

**Vaardigheden:**
- API requests via JavaScript/Python/Postman
- Token management
- Error handling
- Rate limiting awareness
- API security (never expose tokens)
