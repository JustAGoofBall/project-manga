const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

// GET /api/anime - Get all anime
router.get('/', animeController.getAllAnime);

// GET /api/anime/:id - Get specific anime by ID
router.get('/:id', animeController.getAnimeById);

// POST /api/anime - Create new anime
router.post('/', animeController.createAnime);

// PUT /api/anime/:id - Update anime
router.put('/:id', animeController.updateAnime);

// DELETE /api/anime/:id - Delete anime
router.delete('/:id', animeController.deleteAnime);

module.exports = router;
