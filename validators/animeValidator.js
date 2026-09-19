/**
 * Anime Validator
 *
 * Checks what the user sent before it reaches the database.
 * Each function either returns the cleaned-up value, or throws a 400 error
 * that utils/sendError.js turns into a response.
 */

const { badRequest, validateId, validateName } = require('../utils/validate');

/** Anime name: 1-100 characters after trimming. */
const validateAnimeName = (name) => validateName(name, 'Anime');

/** Anime ID from the URL: a whole number above zero. */
const validateAnimeId = (id) => validateId(id, 'anime');

/**
 * Search term for GET /api/search?q=...
 * Shorter limit than a name, since it is only used for a LIKE match.
 */
const validateSearchQuery = (query) => {
  if (!query) {
    throw badRequest('Search query is required');
  }

  if (typeof query !== 'string') {
    throw badRequest('Search query must be a string');
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    throw badRequest('Search query cannot be empty');
  }

  if (trimmed.length > 50) {
    throw badRequest('Search query must be less than 50 characters');
  }

  return trimmed;
};

module.exports = {
  validateAnimeName,
  validateAnimeId,
  validateSearchQuery
};
