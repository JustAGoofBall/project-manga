const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import middleware
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ========== RATE LIMITERS ==========
// General limiter: 100 requests per 15 minutes (production only)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: () => process.env.NODE_ENV !== 'production',
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth limiter: 10 requests per 15 minutes (production only)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: () => process.env.NODE_ENV !== 'production',
  message: { success: false, message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Import routes
const animeRoutes = require('./routes/anime');
const characterRoutes = require('./routes/characters');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const ratingRoutes = require('./routes/ratings');
const myRatingsRoutes = require('./routes/myRatings');
const favoriteRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(cors());               // CORS - allow cross-origin requests
app.use(express.json());
app.use(logger);               // Request/Response logging
app.use('/api', generalLimiter);       // Rate limiting on all API routes
app.use('/api/auth', authLimiter);     // Stricter limit on auth routes

// ========== ROUTES ==========

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Anime Characters API',
    version: '2.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user (body: {username, email, password})',
        'POST /api/auth/login': 'Login user (body: {email, password})',
        'GET /api/auth/me': 'Get current user profile (requires authentication)',
        'PUT /api/auth/me': 'Update current user profile (requires authentication)',
        'DELETE /api/auth/me': 'Delete current user account (requires authentication)'
      },
      anime: {
        'GET /api/anime': 'Get all anime with characters',
        'GET /api/anime/:id': 'Get a specific anime by ID',
        'POST /api/anime': 'Create a new anime (body: {name}) [AUTH REQUIRED]',
        'PUT /api/anime/:id': 'Update an anime (body: {name}) [AUTH REQUIRED]',
        'DELETE /api/anime/:id': 'Delete an anime [AUTH REQUIRED]'
      },
      characters: {
        'GET /api/anime/:animeId/characters': 'Get all characters from an anime',
        'GET /api/anime/:animeId/characters/:characterId': 'Get a specific character',
        'POST /api/anime/:animeId/characters': 'Create a new character (body: {name}) [AUTH REQUIRED]',
        'PUT /api/anime/:animeId/characters/:characterId': 'Update a character (body: {name}) [AUTH REQUIRED]',
        'DELETE /api/anime/:animeId/characters/:characterId': 'Delete a character [AUTH REQUIRED]'
      },
      ratings: {
        'GET /api/anime/:animeId/ratings': 'Get ratings for an anime (includes average score)',
        'POST /api/anime/:animeId/ratings': 'Rate an anime (body: {rating, review?}) [AUTH REQUIRED]',
        'PUT /api/anime/:animeId/ratings/:ratingId': 'Update own rating [AUTH REQUIRED]',
        'DELETE /api/anime/:animeId/ratings/:ratingId': 'Delete own rating [AUTH REQUIRED]',
        'GET /api/ratings/me': 'Get your own ratings [AUTH REQUIRED]'
      },
      favorites: {
        'GET /api/favorites': 'Get your favorites [AUTH REQUIRED]',
        'POST /api/favorites/:animeId': 'Add anime to favorites [AUTH REQUIRED]',
        'DELETE /api/favorites/:animeId': 'Remove anime from favorites [AUTH REQUIRED]'
      },
      search: {
        'GET /api/search?q=name': 'Search for anime by name'
      }
    },
    authentication: {
      note: 'Protected endpoints require authentication',
      header: 'Authorization: Bearer <your-jwt-token>',
      howTo: '1. Register or login to get a token, 2. Add token to Authorization header'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/anime/:animeId/characters', characterRoutes);
app.use('/api/anime/:animeId/ratings', ratingRoutes);
app.use('/api/ratings', myRatingsRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/search', searchRoutes);

// ========== ERROR HANDLING ==========
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

// ========== START SERVER ==========
// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Anime API v2.0 is running on http://localhost:${PORT}`);
    console.log(`📖 Visit http://localhost:${PORT} for API documentation`);
    console.log(`📁 Using MVC architecture`);
  });
}

// Export app for testing
module.exports = app;
