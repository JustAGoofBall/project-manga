/**
 * Rating Validator
 * Validates rating-related input data
 */

/**
 * Validate rating value
 * @param {*} rating - Rating value to validate (must be 1-10)
 * @throws {Error} If validation fails
 * @returns {number} Validated rating as integer
 */
const validateRating = (rating) => {
  if (rating === undefined || rating === null) {
    const error = new Error('Rating is required');
    error.status = 400;
    throw error;
  }

  const num = Number(rating);

  if (isNaN(num) || !Number.isInteger(num)) {
    const error = new Error('Rating must be an integer');
    error.status = 400;
    throw error;
  }

  if (num < 1 || num > 10) {
    const error = new Error('Rating must be between 1 and 10');
    error.status = 400;
    throw error;
  }

  return num;
};

/**
 * Validate review text (optional)
 * @param {*} review - Review text to validate
 * @throws {Error} If validation fails
 * @returns {string|null} Validated review or null
 */
const validateReview = (review) => {
  if (review === undefined || review === null) return null;

  if (typeof review !== 'string') {
    const error = new Error('Review must be a string');
    error.status = 400;
    throw error;
  }

  const trimmed = review.trim();

  if (trimmed.length > 1000) {
    const error = new Error('Review must be less than 1000 characters');
    error.status = 400;
    throw error;
  }

  return trimmed || null;
};

module.exports = { validateRating, validateReview };
