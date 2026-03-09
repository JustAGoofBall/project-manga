/**
 * Character Validator
 * Validates character-related input data
 */

/**
 * Validate character name
 * @param {string} name - Character name to validate
 * @throws {Error} If validation fails
 * @returns {string} Validated and trimmed name
 */
const validateCharacterName = (name) => {
  // Check if name exists
  if (!name) {
    const error = new Error('Character name is required');
    error.status = 400;
    throw error;
  }

  // Check if name is a string
  if (typeof name !== 'string') {
    const error = new Error('Character name must be a string');
    error.status = 400;
    throw error;
  }

  // Trim whitespace
  const trimmedName = name.trim();

  // Check if name is empty after trimming
  if (trimmedName.length === 0) {
    const error = new Error('Character name cannot be empty');
    error.status = 400;
    throw error;
  }

  // Check minimum length
  if (trimmedName.length < 1) {
    const error = new Error('Character name must be at least 1 character long');
    error.status = 400;
    throw error;
  }

  // Check maximum length
  if (trimmedName.length > 100) {
    const error = new Error('Character name must be less than 100 characters');
    error.status = 400;
    throw error;
  }

  return trimmedName;
};

/**
 * Validate character ID
 * @param {string|number} id - Character ID to validate
 * @throws {Error} If validation fails
 * @returns {number} Validated ID as number
 */
const validateCharacterId = (id) => {
  // Convert to number
  const numId = Number(id);

  // Check if it's a valid number
  if (isNaN(numId)) {
    const error = new Error('Invalid character ID format');
    error.status = 400;
    throw error;
  }

  // Check if it's a positive integer
  if (numId <= 0 || !Number.isInteger(numId)) {
    const error = new Error('Character ID must be a positive integer');
    error.status = 400;
    throw error;
  }

  return numId;
};

module.exports = {
  validateCharacterName,
  validateCharacterId
};
