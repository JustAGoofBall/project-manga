/**
 * Anime Controller
 *
 * WHERE THIS SITS IN THE REQUEST FLOW
 *   routes/anime.js  ->  THIS FILE  ->  models/animeModel.js  ->  database
 *
 * A controller's job is only to:
 *   1. validate what the user sent,
 *   2. ask the model to do the database work,
 *   3. turn the result into an HTTP response.
 * It never writes SQL itself - that belongs in the model.
 */

const Anime = require('../models/animeModel');
const { validateAnimeName, validateAnimeId, validateSearchQuery } = require('../validators/animeValidator');
const sendError = require('../utils/sendError');

// Used for the 409 response when two anime would end up with the same name.
const DUPLICATE_NAME_MESSAGE = 'An anime with this name already exists';

/**
 * Get all anime, each with its characters.
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
    sendError(res, error);
  }
};

/**
 * Get one anime by its ID.
 * GET /api/anime/:id
 */
exports.getAnimeById = async (req, res) => {
  try {
    // Throws a 400 error if the ID is not a positive whole number.
    const id = validateAnimeId(req.params.id);

    const anime = await Anime.getById(id);
    if (!anime) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    res.json({ success: true, data: anime });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Create a new anime.
 * POST /api/anime          Body: { name: string }
 * Admin only - see routes/anime.js.
 */
exports.createAnime = async (req, res) => {
  try {
    const name = validateAnimeName(req.body.name);

    const anime = await Anime.create(name);

    res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: anime
    });
  } catch (error) {
    // A duplicate name trips the UNIQUE constraint -> 409.
    sendError(res, error, DUPLICATE_NAME_MESSAGE);
  }
};

/**
 * Rename an existing anime.
 * PUT /api/anime/:id       Body: { name: string }
 * Admin only.
 */
exports.updateAnime = async (req, res) => {
  try {
    const id = validateAnimeId(req.params.id);
    const name = validateAnimeName(req.body.name);

    const anime = await Anime.update(id, name);
    if (!anime) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    res.json({
      success: true,
      message: 'Anime updated successfully',
      data: anime
    });
  } catch (error) {
    sendError(res, error, DUPLICATE_NAME_MESSAGE);
  }
};

/**
 * Delete an anime. Its characters, ratings and favorites go with it,
 * because those tables use ON DELETE CASCADE (see config/db.js).
 * DELETE /api/anime/:id
 * Admin only.
 */
exports.deleteAnime = async (req, res) => {
  try {
    const id = validateAnimeId(req.params.id);

    const deleted = await Anime.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    res.json({ success: true, message: 'Anime deleted successfully' });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Search anime by (partial) name.
 * GET /api/search?q=naruto
 */
exports.searchAnime = async (req, res) => {
  try {
    const query = validateSearchQuery(req.query.q);

    const results = await Anime.search(query);

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    sendError(res, error);
  }
};
