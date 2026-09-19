/**
 * Rating Validator
 *
 * A rating is a score from 1 to 10, with an optional written review.
 */

const { badRequest } = require('../utils/validate');

const MIN_RATING = 1;
const MAX_RATING = 10;
const MAX_REVIEW_LENGTH = 1000;

/**
 * Score: a whole number from 1 to 10. Required.
 *
 * @param {*} rating - Raw value from req.body.rating
 * @returns {number} The score as a real number
 */
const validateRating = (rating) => {
  // Checked explicitly because 0 is falsy but still worth its own message.
  if (rating === undefined || rating === null) {
    throw badRequest('Rating is required');
  }

  const score = Number(rating);

  if (isNaN(score) || !Number.isInteger(score)) {
    throw badRequest('Rating must be an integer');
  }

  if (score < MIN_RATING || score > MAX_RATING) {
    throw badRequest(`Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
  }

  return score;
};

/**
 * Review text. Optional - leaving it out is fine.
 *
 * @param {*} review - Raw value from req.body.review
 * @returns {string|null} The trimmed review, or null when there is none
 */
const validateReview = (review) => {
  if (review === undefined || review === null) return null;

  if (typeof review !== 'string') {
    throw badRequest('Review must be a string');
  }

  const trimmed = review.trim();

  if (trimmed.length > MAX_REVIEW_LENGTH) {
    throw badRequest(`Review must be less than ${MAX_REVIEW_LENGTH} characters`);
  }

  // An empty string counts as "no review".
  return trimmed || null;
};

module.exports = { validateRating, validateReview };
