const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/favorites - Get authenticated user's favorites (auth required)
router.get('/', authMiddleware, favoriteController.getUserFavorites);

// POST /api/favorites/:animeId - Add anime to favorites (auth required)
router.post('/:animeId', authMiddleware, favoriteController.addFavorite);

// DELETE /api/favorites/:animeId - Remove anime from favorites (auth required)
router.delete('/:animeId', authMiddleware, favoriteController.removeFavorite);

module.exports = router;
