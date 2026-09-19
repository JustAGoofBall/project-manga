/**
 * Auth Validator
 *
 * Checks registration and login input before it reaches the database.
 * Register is strict (this data gets stored); login is deliberately loose,
 * because the real check is "does the password match" - being picky here
 * would only tell an attacker which half of the guess was wrong.
 */

const { badRequest } = require('../utils/validate');

const USERNAME_MIN = 3;
const USERNAME_MAX = 50;
const EMAIL_MAX = 100;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 100;

// Letters, numbers, underscore and hyphen only - no spaces or punctuation.
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

// Deliberately simple: "something@something.something" with no spaces.
// Fully correct email matching is not worth the regex; the real proof
// that an address works is sending mail to it.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Confirm a field is present and is text.
 * Every field below needs this same pair of checks first.
 *
 * @param {*} value - The raw value from the request body
 * @param {string} label - Field name for the message, e.g. 'Username'
 * @returns {string} The value, now known to be a string
 */
function requireText(value, label) {
  if (!value) {
    throw badRequest(`${label} is required`);
  }

  if (typeof value !== 'string') {
    throw badRequest(`${label} must be a string`);
  }

  return value;
}

/**
 * Validate the body of POST /api/auth/register.
 *
 * @param {Object} data - req.body
 * @returns {{username: string, email: string, password: string}} Cleaned values
 */
const validateRegister = (data) => {
  const { username, email, password } = data;

  // ---- Username ----
  const trimmedUsername = requireText(username, 'Username').trim();

  if (trimmedUsername.length < USERNAME_MIN) {
    throw badRequest(`Username must be at least ${USERNAME_MIN} characters long`);
  }

  if (trimmedUsername.length > USERNAME_MAX) {
    throw badRequest(`Username must be less than ${USERNAME_MAX} characters`);
  }

  if (!USERNAME_PATTERN.test(trimmedUsername)) {
    throw badRequest('Username can only contain letters, numbers, underscores and hyphens');
  }

  // ---- Email ----
  // Lowercased so Foo@x.com and foo@x.com cannot become two accounts.
  const trimmedEmail = requireText(email, 'Email').trim().toLowerCase();

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    throw badRequest('Invalid email format');
  }

  if (trimmedEmail.length > EMAIL_MAX) {
    throw badRequest(`Email must be less than ${EMAIL_MAX} characters`);
  }

  // ---- Password ----
  requireText(password, 'Password');

  if (password.length < PASSWORD_MIN) {
    throw badRequest(`Password must be at least ${PASSWORD_MIN} characters long`);
  }

  if (password.length > PASSWORD_MAX) {
    throw badRequest(`Password must be less than ${PASSWORD_MAX} characters`);
  }

  return {
    username: trimmedUsername,
    email: trimmedEmail,
    // Not trimmed: leading/trailing spaces may be part of the password on purpose.
    password
  };
};

/**
 * Validate the body of POST /api/auth/login.
 * Only checks that both fields are present text - see the note at the top.
 *
 * @param {Object} data - req.body
 * @returns {{email: string, password: string}} Cleaned values
 */
const validateLogin = (data) => {
  const { email, password } = data;

  return {
    email: requireText(email, 'Email').trim().toLowerCase(),
    password: requireText(password, 'Password')
  };
};

module.exports = {
  validateRegister,
  validateLogin
};
