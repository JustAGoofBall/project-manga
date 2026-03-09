const Favorite = require('../models/favoriteModel');
const Anime = require('../models/animeModel');
const { validateAnimeId } = require('../validators/animeValidator');

/**
 * Favorite Controller
 * Handles all favorite-related requests
 */

/**
 * Get authenticated user's favorites
 * GET /api/favorites
 */
exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.getByUser(req.user.id);
    res.json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/**
 * Add an anime to favorites
 * POST /api/favorites/:animeId
 */
exports.addFavorite = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);

    const anime = await Anime.getById(animeId);
    if (!anime) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    const existing = await Favorite.getByUserAndAnime(req.user.id, animeId);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Anime is already in your favorites' });
    }

    const favorite = await Favorite.add(req.user.id, animeId);

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/**
 * Remove an anime from favorites
 * DELETE /api/favorites/:animeId
 */
exports.removeFavorite = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);

    const existing = await Favorite.getByUserAndAnime(req.user.id, animeId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Anime is not in your favorites' });
    }

    await Favorite.remove(req.user.id, animeId);

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};
