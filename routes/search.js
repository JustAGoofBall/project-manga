const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

// GET /api/search?q=query - Search for anime
router.get('/', animeController.searchAnime);

module.exports = router;
