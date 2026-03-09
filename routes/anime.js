const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
// GET /api/anime - Get all anime
router.get('/', animeController.getAllAnime);

// GET /api/anime/:id - Get specific anime by ID
router.get('/:id', animeController.getAnimeById);

// Protected routes (authentication required)
// POST /api/anime - Create new anime
router.post('/', authMiddleware, animeController.createAnime);

// PUT /api/anime/:id - Update anime
router.put('/:id', authMiddleware, animeController.updateAnime);

// DELETE /api/anime/:id - Delete anime
router.delete('/:id', authMiddleware, animeController.deleteAnime);

module.exports = router;
