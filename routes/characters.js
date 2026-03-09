const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent route
const characterController = require('../controllers/characterController');

// GET /api/anime/:id/characters - Get all characters from an anime
router.get('/', characterController.getCharactersByAnime);

// GET /api/anime/:animeId/characters/:characterId - Get specific character
router.get('/:characterId', characterController.getCharacterById);

// POST /api/anime/:id/characters - Create new character
router.post('/', characterController.createCharacter);

// PUT /api/anime/:animeId/characters/:characterId - Update character
router.put('/:characterId', characterController.updateCharacter);

// DELETE /api/anime/:animeId/characters/:characterId - Delete character
router.delete('/:characterId', characterController.deleteCharacter);

module.exports = router;
