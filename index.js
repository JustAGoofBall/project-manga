const express = require('express');
require('dotenv').config();

// Import middleware
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Import routes
const animeRoutes = require('./routes/anime');
const characterRoutes = require('./routes/characters');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(logger); // Request/Response logging

// ========== ROUTES ==========

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Anime Characters API',
    version: '2.0.0',
    endpoints: {
      anime: {
        'GET /api/anime': 'Get all anime with characters',
        'GET /api/anime/:id': 'Get a specific anime by ID',
        'POST /api/anime': 'Create a new anime (body: {name})',
        'PUT /api/anime/:id': 'Update an anime (body: {name})',
        'DELETE /api/anime/:id': 'Delete an anime'
      },
      characters: {
        'GET /api/anime/:animeId/characters': 'Get all characters from an anime',
        'GET /api/anime/:animeId/characters/:characterId': 'Get a specific character',
        'POST /api/anime/:animeId/characters': 'Create a new character (body: {name})',
        'PUT /api/anime/:animeId/characters/:characterId': 'Update a character (body: {name})',
        'DELETE /api/anime/:animeId/characters/:characterId': 'Delete a character'
      },
      search: {
        'GET /api/search?q=name': 'Search for anime by name'
      }
    }
  });
});

// API Routes
app.use('/api/anime', animeRoutes);
app.use('/api/anime/:animeId/characters', characterRoutes);
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
