/**
 * Rating Controller
 *
 * WHERE THIS SITS IN THE REQUEST FLOW
 *   routes/ratings.js / routes/myRatings.js  ->  THIS FILE
 *   ->  models/ratingModel.js  ->  database
 *
 * Rules this file enforces:
 *   - a score is 1-10 (checked by validators/ratingValidator.js)
 *   - one user can rate one anime only once (UNIQUE user_id + anime_id)
 *   - you may only edit or delete your OWN rating
 */

const Rating = require('../models/ratingModel');
const Anime = require('../models/animeModel');
const { validateRating, validateReview } = require('../validators/ratingValidator');
const { validateAnimeId } = require('../validators/animeValidator');
const sendError = require('../utils/sendError');

/**
 * Find a rating and confirm it belongs to the logged-in user.
 *
 * Returns the rating, or sends the correct error response and returns null.
 * Both update and delete need exactly this check, so it lives in one place.
 *
 * @param {string} action - 'update' or 'delete', used in the 403 message
 * @returns {Promise<Object|null>} the rating, or null if a response was already sent
 */
async function findOwnRating(req, res, ratingId, action) {
  const existing = await Rating.getById(ratingId);

  if (!existing) {
    res.status(404).json({ success: false, message: 'Rating not found' });
    return null;
  }

  if (existing.user_id !== req.user.id) {
    res.status(403).json({ success: false, message: `You can only ${action} your own ratings` });
    return null;
  }

  return existing;
}

/**
 * List all ratings for one anime, plus the average score.
 * GET /api/anime/:animeId/ratings
 */
exports.getRatingsForAnime = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);

    const anime = await Anime.getById(animeId);
    if (!anime) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    const data = await Rating.getByAnime(animeId);

    res.json({
      success: true,
      anime: { id: anime.id, name: anime.name },
      average: data.average,
      count: data.count,
      data: data.ratings
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * List the logged-in user's own ratings.
 * GET /api/ratings/me
 */
exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.getByUser(req.user.id);

    res.json({ success: true, count: ratings.length, data: ratings });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Rate an anime.
 * POST /api/anime/:animeId/ratings     Body: { rating: 1-10, review?: string }
 */
exports.createRating = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);

    const anime = await Anime.getById(animeId);
    if (!anime) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    const rating = validateRating(req.body.rating);
    const review = validateReview(req.body.review);

    // One rating per user per anime - tell them to use PUT instead.
    const existing = await Rating.getByUserAndAnime(req.user.id, animeId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already rated this anime. Use PUT to update your rating.'
      });
    }

    const newRating = await Rating.create(req.user.id, animeId, rating, review);

    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: newRating
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Change your own rating.
 * PUT /api/anime/:animeId/ratings/:ratingId    Body: { rating: 1-10, review?: string }
 */
exports.updateRating = async (req, res) => {
  try {
    const ratingId = validateAnimeId(req.params.ratingId);

    // Returns null when it already sent a 404 or 403.
    const existing = await findOwnRating(req, res, ratingId, 'update');
    if (!existing) return;

    const rating = validateRating(req.body.rating);
    const review = validateReview(req.body.review);

    const updated = await Rating.update(ratingId, rating, review);

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: updated
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Delete your own rating.
 * DELETE /api/anime/:animeId/ratings/:ratingId
 */
exports.deleteRating = async (req, res) => {
  try {
    const ratingId = validateAnimeId(req.params.ratingId);

    const existing = await findOwnRating(req, res, ratingId, 'delete');
    if (!existing) return;

    await Rating.delete(ratingId);

    res.json({ success: true, message: 'Rating deleted successfully' });
  } catch (error) {
    sendError(res, error);
  }
};
