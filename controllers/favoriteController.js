/**
 * Favorite Controller
 *
 * WHERE THIS SITS IN THE REQUEST FLOW
 *   routes/favorites.js  ->  THIS FILE  ->  models/favoriteModel.js  ->  database
 *
 * A favorite is just a link between a user and an anime.
 * Every route here requires login, so `req.user` is always set by
 * authMiddleware before we get here - that is where req.user.id comes from.
 */

const Favorite = require('../models/favoriteModel');
const Anime = require('../models/animeModel');
const { validateFavoriteAnimeId } = require('../validators/favoriteValidator');
const sendError = require('../utils/sendError');

/**
 * List the logged-in user's favorites.
 * GET /api/favorites
 */
exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.getByUser(req.user.id);

    res.json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Add an anime to the logged-in user's favorites.
 * POST /api/favorites/:animeId
 */
exports.addFavorite = async (req, res) => {
  try {
    const animeId = validateFavoriteAnimeId(req.params.animeId);

    // You cannot favorite an anime that does not exist.
    const anime = await Anime.getById(animeId);
    if (!anime) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    // Favoriting twice is a conflict, not an error the user can fix by retrying.
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
    sendError(res, error);
  }
};

/**
 * Remove an anime from the logged-in user's favorites.
 * DELETE /api/favorites/:animeId
 */
exports.removeFavorite = async (req, res) => {
  try {
    const animeId = validateFavoriteAnimeId(req.params.animeId);

    // Scoped to req.user.id, so one user can never remove another user's favorite.
    const existing = await Favorite.getByUserAndAnime(req.user.id, animeId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Anime is not in your favorites' });
    }

    await Favorite.remove(req.user.id, animeId);

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    sendError(res, error);
  }
};
