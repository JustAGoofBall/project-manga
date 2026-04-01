# Bewijslast Leeruitkomst 3: API's Gebruiken

## Projecten

(1) Lit, J. (2026). Project Manga - Full-stack API usage in React frontend.
    Retrieved from https://github.com/justi/project-manga

## Overige Bewijslast

(2) **Frontend API Usage**
    - File: `/frontend/src/context/AuthContext.jsx` - Authentication API calls
    - Functions: login(), register(), logout(), updateProfile()
    - All use fetch API with proper headers and error handling

(3) **React Pages Using API**
    - File: `/frontend/src/pages/Login.jsx` - Uses /api/auth/login endpoint
    - File: `/frontend/src/pages/Register.jsx` - Uses /api/auth/register endpoint
    - File: `/frontend/src/pages/Favorites.jsx` - Uses /api/favorites endpoints
    - File: `/frontend/src/pages/AnimeDetail.jsx` - Fetches anime and related data
    - All include error handling and loading states

(4) **Protected Routes & Tokens**
    - File: `/frontend/src/components/PrivateRoute.jsx` - Token validation
    - Token storage: localStorage.getItem('token')
    - Token usage: 'Authorization': `Bearer ${token}`
    - Automatic token refresh on request

(5) **Fetch Implementation Examples**
    - All use fetch API with proper options
    - Headers: 'Content-Type': 'application/json', 'Authorization': 'Bearer token'
    - Methods: GET, POST, PUT, DELETE properly used
    - Response validation: check data.success before using

(6) **Error Handling**
    - Status code checking (200, 201, 400, 401, 404, 500)
    - Error messages displayed to user
    - Graceful fallbacks for failed requests
    - Retry logic for failed API calls

(7) **Real World Usage Evidence**
    - Users can register, login, logout
    - Add/remove favorites via API
    - Submit ratings via API
    - Admin functions via protected API endpoints

## Feedback

[Nog in te vullen door Timo & Samir]
