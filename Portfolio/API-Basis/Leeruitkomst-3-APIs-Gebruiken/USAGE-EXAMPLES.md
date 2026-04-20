# 🔌 API Usage Examples - React Consuming Express

## Architecture
```
React Frontend (port 5173)
        ↓
    fetch() / axios
        ↓
Express Backend (port 3000)
        ↓
    Database / Controllers / Models
```

## Voorbeeld 1: GET Request (List)

### React Component Code
```jsx
// frontend/src/pages/AnimeList.jsx

import { useState, useEffect } from 'react';

export function AnimeList() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API call naar Express backend
    fetch('http://localhost:3000/api/anime')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnime(data.data);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Fout: {error}</div>;

  return (
    <ul>
      {anime.map(a => (
        <li key={a.id}>{a.name}</li>
      ))}
    </ul>
  );
}
```

**Backend Endpoint:** [GET /api/anime](../../../routes/anime.js)

---

## Voorbeeld 2: POST Request met Auth (Create)

### React Component Code
```jsx
// frontend/src/pages/AddFavorite.jsx

import { useState } from 'react';

export function AddFavorite({ animeId, token }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddFavorite = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token  // JWT authentication
        },
        body: JSON.stringify({
          anime_id: animeId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Added to favorites!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAddFavorite} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Favorites'}
      {message && <p>{message}</p>}
    </button>
  );
}
```

**Backend Endpoint:** [POST /api/favorites](../../../routes/favorites.js)

---

## Voorbeeld 3: API Error Handling

### React Custom Hook
```jsx
// frontend/src/hooks/useApi.js

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url, options)
      .then(res => {
        // Handle non-200 responses
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data.success) {
          throw new Error(data.message || 'API Error');
        }
        setData(data.data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { data, error, loading };
}

// Usage in component:
const { data: anime, loading, error } = useApi('/api/anime');
```

---

## Environment Configuration

### .env File Structure
```
VITE_API_URL=http://localhost:3000/api
VITE_JWT_STORAGE_KEY=manga_token
```

### axios Service (Alternative to fetch)
```javascript
// frontend/src/services/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Auto-attach JWT token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('manga_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default apiClient;

// Usage: apiClient.get('/anime')
```

---

## 📊 API Integration Checklist

| Feature | Implemented | Location |
|---|---|---|
| GET requests (list/detail) | ✅ | /frontend/src/ pages & components |
| POST requests (create) | ✅ | Add favorite, create rating |
| PUT requests (update) | ✅ | Update profile, update rating |
| DELETE requests | ✅ | Remove favorite |
| JWT Authentication | ✅ | Token in Authorization header |
| Error Handling | ✅ | Try/catch, error state |
| Loading States | ✅ | Loading spinners |
| Environment Config | ✅ | .env file |

Zie [evidence/code-snippets](evidence/code-snippets/) voor complete file examples.
