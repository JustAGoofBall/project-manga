const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams gives access to :animeId from parent route
const ratingController = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/anime/:animeId/ratings - Get all ratings for an anime (public)
router.get('/', ratingController.getRatingsForAnime);

// POST /api/anime/:animeId/ratings - Rate an anime (auth required)
router.post('/', authMiddleware, ratingController.createRating);

// PUT /api/anime/:animeId/ratings/:ratingId - Update own rating (auth required)
router.put('/:ratingId', authMiddleware, ratingController.updateRating);

// DELETE /api/anime/:animeId/ratings/:ratingId - Delete own rating (auth required)
router.delete('/:ratingId', authMiddleware, ratingController.deleteRating);

module.exports = router;
