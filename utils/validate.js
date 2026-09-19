/**
 * Shared validation building blocks.
 *
 * WHY THIS EXISTS
 * Checking "is this a valid ID" and "is this a usable name" was written out
 * separately for anime, characters and favorites - the same code three times,
 * differing only in the word used in the error message. It is written once
 * here and the validators/ files just fill in the noun.
 *
 * THE RULE ABOUT ERRORS
 * Everything here throws an Error carrying `.status = 400`. That property is
 * the agreed signal for "the user sent something invalid", and utils/sendError.js
 * turns it into a 400 response. A thrown error without it counts as a server bug.
 */

/**
 * Build a 400 "bad request" error.
 *
 * Use it as `throw badRequest('Rating is required');` - three lines of
 * new Error / set status / throw collapse into one readable line.
 *
 * @param {string} message - What the user did wrong
 * @returns {Error} An error tagged with status 400
 */
function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

/**
 * Check that a value is a usable database ID: a whole number above zero.
 *
 * @param {string|number} value - The raw value, usually straight from the URL
 * @param {string} noun - Lowercase name for messages, e.g. 'anime'
 * @returns {number} The ID as a real number
 */
function validateId(value, noun) {
  const id = Number(value);

  if (isNaN(id)) {
    throw badRequest(`Invalid ${noun} ID format`);
  }

  // Rejects 0, negatives and decimals like 1.5.
  if (id <= 0 || !Number.isInteger(id)) {
    throw badRequest(`${capitalize(noun)} ID must be a positive integer`);
  }

  return id;
}

/**
 * Check that a value is a non-empty name of reasonable length.
 *
 * @param {*} value - The raw value from the request body
 * @param {string} noun - Capitalized name for messages, e.g. 'Anime'
 * @param {number} [maxLength=100] - Longest name allowed
 * @returns {string} The name with surrounding whitespace removed
 */
function validateName(value, noun, maxLength = 100) {
  if (!value) {
    throw badRequest(`${noun} name is required`);
  }

  if (typeof value !== 'string') {
    throw badRequest(`${noun} name must be a string`);
  }

  const name = value.trim();

  // Catches input that is nothing but spaces.
  if (name.length === 0) {
    throw badRequest(`${noun} name cannot be empty`);
  }

  if (name.length > maxLength) {
    throw badRequest(`${noun} name must be less than ${maxLength} characters`);
  }

  return name;
}

/** Turn 'anime' into 'Anime' for the start of a sentence. */
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = { badRequest, validateId, validateName };
