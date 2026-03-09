const Rating = require('../models/ratingModel');
const Anime = require('../models/animeModel');
const { validateRating, validateReview } = require('../validators/ratingValidator');
const { validateAnimeId } = require('../validators/animeValidator');

/**
 * Rating Controller
 * Handles all rating-related requests
 */

/**
 * Get all ratings for an anime
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
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/**
 * Get authenticated user's ratings
 * GET /api/ratings/me
 */
exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.getByUser(req.user.id);
    res.json({ success: true, count: ratings.length, data: ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/**
 * Create a rating for an anime
 * POST /api/anime/:animeId/ratings
 * Body: { rating: number, review?: string }
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
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/**
 * Update a rating
 * PUT /api/anime/:animeId/ratings/:ratingId
 * Body: { rating: number, review?: string }
 */
exports.updateRating = async (req, res) => {
  try {
    const ratingId = validateAnimeId(req.params.ratingId);

    const existing = await Rating.getById(ratingId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only update your own ratings' });
    }

    const rating = validateRating(req.body.rating);
    const review = validateReview(req.body.review);

    const updated = await Rating.update(ratingId, rating, review);

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: updated
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

/**
 * Delete a rating
 * DELETE /api/anime/:animeId/ratings/:ratingId
 */
exports.deleteRating = async (req, res) => {
  try {
    const ratingId = validateAnimeId(req.params.ratingId);

    const existing = await Rating.getById(ratingId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own ratings' });
    }

    await Rating.delete(ratingId);

    res.json({ success: true, message: 'Rating deleted successfully' });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};
