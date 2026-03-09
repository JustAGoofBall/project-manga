/**
 * Auth Validator
 * Validates authentication-related input data
 */

/**
 * Validate registration data
 * @param {Object} data - Registration data
 * @returns {Object} Validated and sanitized data
 * @throws {Error} If validation fails
 */
const validateRegister = (data) => {
  const { username, email, password } = data;

  // Validate username
  if (!username) {
    const error = new Error('Username is required');
    error.status = 400;
    throw error;
  }

  if (typeof username !== 'string') {
    const error = new Error('Username must be a string');
    error.status = 400;
    throw error;
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    const error = new Error('Username must be at least 3 characters long');
    error.status = 400;
    throw error;
  }

  if (trimmedUsername.length > 50) {
    const error = new Error('Username must be less than 50 characters');
    error.status = 400;
    throw error;
  }

  // Username can only contain letters, numbers, underscores and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
    const error = new Error('Username can only contain letters, numbers, underscores and hyphens');
    error.status = 400;
    throw error;
  }

  // Validate email
  if (!email) {
    const error = new Error('Email is required');
    error.status = 400;
    throw error;
  }

  if (typeof email !== 'string') {
    const error = new Error('Email must be a string');
    error.status = 400;
    throw error;
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    const error = new Error('Invalid email format');
    error.status = 400;
    throw error;
  }

  if (trimmedEmail.length > 100) {
    const error = new Error('Email must be less than 100 characters');
    error.status = 400;
    throw error;
  }

  // Validate password
  if (!password) {
    const error = new Error('Password is required');
    error.status = 400;
    throw error;
  }

  if (typeof password !== 'string') {
    const error = new Error('Password must be a string');
    error.status = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters long');
    error.status = 400;
    throw error;
  }

  if (password.length > 100) {
    const error = new Error('Password must be less than 100 characters');
    error.status = 400;
    throw error;
  }

  return {
    username: trimmedUsername,
    email: trimmedEmail,
    password // Don't trim password - whitespace might be intentional
  };
};

/**
 * Validate login data
 * @param {Object} data - Login data
 * @returns {Object} Validated and sanitized data
 * @throws {Error} If validation fails
 */
const validateLogin = (data) => {
  const { email, password } = data;

  // Validate email
  if (!email) {
    const error = new Error('Email is required');
    error.status = 400;
    throw error;
  }

  if (typeof email !== 'string') {
    const error = new Error('Email must be a string');
    error.status = 400;
    throw error;
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Validate password
  if (!password) {
    const error = new Error('Password is required');
    error.status = 400;
    throw error;
  }

  if (typeof password !== 'string') {
    const error = new Error('Password must be a string');
    error.status = 400;
    throw error;
  }

  return {
    email: trimmedEmail,
    password
  };
};

module.exports = {
  validateRegister,
  validateLogin
};
