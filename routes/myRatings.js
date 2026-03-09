const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/ratings/me - Get authenticated user's own ratings (auth required)
router.get('/me', authMiddleware, ratingController.getUserRatings);

module.exports = router;
