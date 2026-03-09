const Character = require('../models/characterModel');
const { validateCharacterName, validateCharacterId } = require('../validators/characterValidator');
const { validateAnimeId } = require('../validators/animeValidator');

/**
 * Character Controller
 * Handles all character-related requests
 */

/**
 * Get all characters from a specific anime
 * GET /api/anime/:animeId/characters
 */
exports.getCharactersByAnime = async (req, res) => {
  try {
    // Validate anime ID
    const animeId = validateAnimeId(req.params.animeId);
    const result = await Character.getAllByAnime(animeId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    res.json({
      success: true,
      anime: result.anime,
      count: result.characters.length,
      data: result.characters
    });
  } catch (error) {
    // Handle validation errors
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};

/**
 * Get a specific character from a specific anime
 * GET /api/anime/:animeId/characters/:characterId
 */
exports.getCharacterById = async (req, res) => {
  try {
    // Validate IDs
    const animeId = validateAnimeId(req.params.animeId);
    const characterId = validateCharacterId(req.params.characterId);
    const result = await Character.getById(animeId, characterId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      anime: result.anime,
      data: result.character
    });
  } catch (error) {
    // Handle validation errors
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};

/**
 * Create a new character for an anime
 * POST /api/anime/:animeId/characters
 * Body: { name: string }
 */
exports.createCharacter = async (req, res) => {
  try {
    // Validate anime ID and character name
    const animeId = validateAnimeId(req.params.animeId);
    const validatedName = validateCharacterName(req.body.name);
    
    const character = await Character.create(animeId, validatedName);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Character created successfully',
      data: character
    });
  } catch (error) {
    // Handle validation errors
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};

/**
 * Update a character
 * PUT /api/anime/:animeId/characters/:characterId
 * Body: { name: string }
 */
exports.updateCharacter = async (req, res) => {
  try {
    // Validate IDs and name
    const animeId = validateAnimeId(req.params.animeId);
    const characterId = validateCharacterId(req.params.characterId);
    const validatedName = validateCharacterName(req.body.name);
    
    const character = await Character.update(animeId, characterId, validatedName);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Character updated successfully',
      data: character
    });
  } catch (error) {
    // Handle validation errors
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};

/**
 * Delete a character
 * DELETE /api/anime/:animeId/characters/:characterId
 */
exports.deleteCharacter = async (req, res) => {
  try {
    // Validate IDs
    const animeId = validateAnimeId(req.params.animeId);
    const characterId = validateCharacterId(req.params.characterId);
    const deleted = await Character.delete(animeId, characterId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Character deleted successfully'
    });
  } catch (error) {
    // Handle validation errors
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};
