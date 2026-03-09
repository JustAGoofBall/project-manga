const Anime = require('../models/animeModel');
const { validateAnimeName, validateAnimeId, validateSearchQuery } = require('../validators/animeValidator');

/**
 * Anime Controller
 * Handles all anime-related requests
 */

/**
 * Get all anime with their characters
 * GET /api/anime
 */
exports.getAllAnime = async (req, res) => {
  try {
    const anime = await Anime.getAll();
    
    res.json({
      success: true,
      count: anime.length,
      data: anime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};

/**
 * Get a specific anime by ID
 * GET /api/anime/:id
 */
exports.getAnimeById = async (req, res) => {
  try {
    // Validate ID
    const id = validateAnimeId(req.params.id);
    const anime = await Anime.getById(id);
    
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    res.json({
      success: true,
      data: anime
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
 * Create a new anime
 * POST /api/anime
 * Body: { name: string }
 */
exports.createAnime = async (req, res) => {
  try {
    // Validate anime name
    const validatedName = validateAnimeName(req.body.name);
    
    const anime = await Anime.create(validatedName);
    
    res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: anime
    });
  } catch (error) {
    // Handle validation errors
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    // Handle duplicate errors
    if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT' || error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'An anime with this name already exists'
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
 * Update an anime
 * PUT /api/anime/:id
 * Body: { name: string }
 */
exports.updateAnime = async (req, res) => {
  try {
    // Validate ID and name
    const id = validateAnimeId(req.params.id);
    const validatedName = validateAnimeName(req.body.name);
    
    const anime = await Anime.update(id, validatedName);
    
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Anime updated successfully',
      data: anime
    });
  } catch (error) {
    // Handle validation errors
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    // Handle duplicate errors
    if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT' || error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'An anime with this name already exists'
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
 * Delete an anime (and its characters due to CASCADE)
 * DELETE /api/anime/:id
 */
exports.deleteAnime = async (req, res) => {
  try {
    // Validate ID
    const id = validateAnimeId(req.params.id);
    const deleted = await Anime.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Anime deleted successfully'
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
 * Search for anime by name
 * GET /api/search?q=query
 */
exports.searchAnime = async (req, res) => {
  try {
    // Validate search query
    const validatedQuery = validateSearchQuery(req.query.q);
    
    const results = await Anime.search(validatedQuery);
    
    res.json({
      success: true,
      count: results.length,
      data: results
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
