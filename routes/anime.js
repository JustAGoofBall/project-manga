const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
// GET /api/anime - Get all anime
router.get('/', animeController.getAllAnime);

// GET /api/anime/:id - Get specific anime by ID
router.get('/:id', animeController.getAnimeById);

// Protected routes (admin authentication required)
// POST /api/anime - Create new anime (admin only)
router.post('/', authMiddleware, adminMiddleware, animeController.createAnime);

// PUT /api/anime/:id - Update anime (admin only)
router.put('/:id', authMiddleware, adminMiddleware, animeController.updateAnime);

// DELETE /api/anime/:id - Delete anime (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, animeController.deleteAnime);

module.exports = router;
