/**
 * Favorite Validator
 * Validates favorite-related input data
 */

/**
 * Validate anime ID for favorites
 * @param {string|number} id - Anime ID to validate
 * @throws {Error} If validation fails
 * @returns {number} Validated ID as number
 */
const validateFavoriteAnimeId = (id) => {
  const numId = Number(id);

  if (isNaN(numId)) {
    const error = new Error('Invalid anime ID format');
    error.status = 400;
    throw error;
  }

  if (numId <= 0 || !Number.isInteger(numId)) {
    const error = new Error('Anime ID must be a positive integer');
    error.status = 400;
    throw error;
  }

  return numId;
};

module.exports = { validateFavoriteAnimeId };
