/**
 * Anime Validator
 * Validates anime-related input data
 */

/**
 * Validate anime name
 * @param {string} name - Anime name to validate
 * @throws {Error} If validation fails
 */
const validateAnimeName = (name) => {
  // Check if name exists
  if (!name) {
    const error = new Error('Anime name is required');
    error.status = 400;
    throw error;
  }

  // Check if name is a string
  if (typeof name !== 'string') {
    const error = new Error('Anime name must be a string');
    error.status = 400;
    throw error;
  }

  // Trim whitespace
  const trimmedName = name.trim();

  // Check if name is empty after trimming
  if (trimmedName.length === 0) {
    const error = new Error('Anime name cannot be empty');
    error.status = 400;
    throw error;
  }

  // Check minimum length
  if (trimmedName.length < 1) {
    const error = new Error('Anime name must be at least 1 character long');
    error.status = 400;
    throw error;
  }

  // Check maximum length
  if (trimmedName.length > 100) {
    const error = new Error('Anime name must be less than 100 characters');
    error.status = 400;
    throw error;
  }

  return trimmedName;
};

/**
 * Validate anime ID
 * @param {string|number} id - Anime ID to validate
 * @throws {Error} If validation fails
 * @returns {number} Validated ID as number
 */
const validateAnimeId = (id) => {
  // Convert to number
  const numId = Number(id);

  // Check if it's a valid number
  if (isNaN(numId)) {
    const error = new Error('Invalid anime ID format');
    error.status = 400;
    throw error;
  }

  // Check if it's a positive integer
  if (numId <= 0 || !Number.isInteger(numId)) {
    const error = new Error('Anime ID must be a positive integer');
    error.status = 400;
    throw error;
  }

  return numId;
};

/**
 * Validate search query
 * @param {string} query - Search query to validate
 * @throws {Error} If validation fails
 * @returns {string} Validated query
 */
const validateSearchQuery = (query) => {
  // Check if query exists
  if (!query) {
    const error = new Error('Search query is required');
    error.status = 400;
    throw error;
  }

  // Check if query is a string
  if (typeof query !== 'string') {
    const error = new Error('Search query must be a string');
    error.status = 400;
    throw error;
  }

  // Trim whitespace
  const trimmedQuery = query.trim();

  // Check if query is empty after trimming
  if (trimmedQuery.length === 0) {
    const error = new Error('Search query cannot be empty');
    error.status = 400;
    throw error;
  }

  // Check maximum length
  if (trimmedQuery.length > 50) {
    const error = new Error('Search query must be less than 50 characters');
    error.status = 400;
    throw error;
  }

  return trimmedQuery;
};

module.exports = {
  validateAnimeName,
  validateAnimeId,
  validateSearchQuery
};
