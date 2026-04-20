# 🎌 Project Manga - Anime API

A professional REST API for managing anime, characters, ratings, and user favorites with complete authentication and authorization.

## 📋 Features

- **User Authentication** - JWT-based login/registration with bcrypt password hashing
- **Anime Management** - Create, read, update, delete anime entries
- **Characters** - Manage characters linked to anime
- **Ratings & Reviews** - Users can rate and review anime (1-10 scale)
- **Favorites** - Users can save their favorite anime
- **Search** - Query anime by name
- **Advanced Logging** - Multi-level logging (INFO, WARN, ERROR) with file and console output
- **Comprehensive Tests** - 80+ automated tests with full coverage
- **Professional Architecture** - MVC pattern following industry standards

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Start the Server
```bash
npm start
```

### Run Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Seed Database
```bash
npm run seed
```

## 📋 Project Structure

```
├── index.js                    # Entry point
├── routes/                     # API endpoints
│   ├── anime.js
│   ├── characters.js
│   ├── auth.js
│   └── search.js
├── controllers/                # Business logic
│   ├── animeController.js
│   ├── characterController.js
│   └── authController.js
├── models/                     # Database operations
│   ├── animeModel.js
│   ├── characterModel.js
│   └── userModel.js
├── middleware/                 # Express middleware
│   ├── logger.js
│   ├── errorHandler.js
│   └── authMiddleware.js
├── config/                     # Configuration
│   └── db.js
├── validators/                 # Input validation
│   └── authValidator.js
├── tests/                      # Automated tests
└── logs/                       # Log files (auto-generated)
```

## 🔐 Authentication

### Register a User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile (Protected)
```bash
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📚 API Endpoints

### Anime
- `GET /api/anime` - List all anime with characters
- `GET /api/anime/:id` - Get specific anime
- `POST /api/anime` - Create anime (requires authentication)
- `PUT /api/anime/:id` - Update anime (requires authentication)
- `DELETE /api/anime/:id` - Delete anime (requires authentication)

### Characters
- `GET /api/anime/:animeId/characters` - List characters
- `GET /api/anime/:animeId/characters/:characterId` - Get character
- `POST /api/anime/:animeId/characters` - Create character (requires authentication)
- `PUT /api/anime/:animeId/characters/:characterId` - Update character (requires authentication)
- `DELETE /api/anime/:animeId/characters/:characterId` - Delete character (requires authentication)

### Search
- `GET /api/search?q=query` - Search anime by name

### User Profile
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/me` - Update profile (protected)

## 🔒 Security Features

- **Password Hashing** - Bcrypt with 10 salt rounds
- **JWT Tokens** - Secure token-based authentication with 7-day expiration
- **Input Validation** - Email, username, and password validation
- **Protected Routes** - Authorization middleware for POST/PUT/DELETE operations
- **SQL Injection Prevention** - Prepared statements for all queries
- **Error Handling** - Comprehensive error messages and proper HTTP status codes

## 📊 Database Schema

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

### Ratings Table
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

### Favorites Table
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

## 📝 Logging

The API includes comprehensive logging:

### Console Output
```
[REQUEST] POST /api/anime - IP: ::1
  Body: {"name":"Demon Slayer"}
[RESPONSE] POST /api/anime - 201 - 15ms
```

### File Logs
Daily log files in `logs/` directory with timestamps, levels (INFO/WARN/ERROR), and full request/response details.

## ✅ Testing

Run the test suite:
```bash
npm test
```

Features:
- 80+ automated tests
- Auth tests (registration, login, profile)
- CRUD operation tests
- Error handling tests
- Full test coverage reports available

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT + Bcrypt
- **Testing**: Jest
- **Logging**: Custom logger with file and console output

## 📖 Architecture

This project follows the **MVC (Model-View-Controller)** pattern:

- **Models** - Database access layer (data operations only)
- **Controllers** - Business logic and request handling
- **Routes** - URL mapping and endpoint definitions
- **Middleware** - Cross-cutting concerns (logging, auth, error handling)

## ❓ Troubleshooting

### "No authorization token provided"
- Add the `Authorization` header with format: `Bearer YOUR_TOKEN`

### "Invalid token"
- Token is incorrect or corrupted. Login again to get a fresh token.

### "Token expired"
- Tokens expire after 7 days. Login again to get a new token.

### Database errors
- Ensure the database schema is set up correctly
- Check database connection in your environment variables
