const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent route
const characterController = require('../controllers/characterController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
// GET /api/anime/:id/characters - Get all characters from an anime
router.get('/', characterController.getCharactersByAnime);

// GET /api/anime/:animeId/characters/:characterId - Get specific character
router.get('/:characterId', characterController.getCharacterById);

// Protected routes (admin authentication required)
// POST /api/anime/:id/characters - Create new character
router.post('/', authMiddleware, adminMiddleware, characterController.createCharacter);

// PUT /api/anime/:animeId/characters/:characterId - Update character
router.put('/:characterId', authMiddleware, adminMiddleware, characterController.updateCharacter);

// DELETE /api/anime/:animeId/characters/:characterId - Delete character
router.delete('/:characterId', authMiddleware, adminMiddleware, characterController.deleteCharacter);

module.exports = router;
