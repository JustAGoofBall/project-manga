/**
 * Character Validator
 *
 * Same shape as the anime validator - the shared checks live in
 * utils/validate.js, this file only supplies the wording.
 */

const { validateId, validateName } = require('../utils/validate');

/** Character name: 1-100 characters after trimming. */
const validateCharacterName = (name) => validateName(name, 'Character');

/** Character ID from the URL: a whole number above zero. */
const validateCharacterId = (id) => validateId(id, 'character');

module.exports = {
  validateCharacterName,
  validateCharacterId
};
