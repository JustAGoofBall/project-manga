const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Handles all database operations for users
 */
class User {
  /**
   * Get all users (without password hashes)
   * @returns {Promise<Array>} Array of users
   */
  static async getAll() {
    const [users] = await db.query(
      'SELECT id, username, email, created_at, updated_at FROM users'
    );
    return users;
  }

  /**
   * Get a specific user by ID (without password hash)
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getById(id) {
    const [users] = await db.query(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Get a user by email (includes password hash for authentication)
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getByEmail(email) {
    const [users] = await db.query(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE email = ?',
      [email]
    );
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Get a user by username (includes password hash for authentication)
   * @param {string} username - Username
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getByUsername(username) {
    const [users] = await db.query(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE username = ?',
      [username]
    );
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Create a new user
   * @param {string} username - Username
   * @param {string} email - Email address
   * @param {string} password - Plain text password (will be hashed)
   * @returns {Promise<Object>} Created user object (without password)
   */
  static async create(username, email, password) {
    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );

    return {
      id: result.insertId,
      username,
      email,
      created_at: new Date()
    };
  }

  /**
   * Update a user
   * @param {number} id - User ID
   * @param {Object} updates - Object with fields to update
   * @returns {Promise<Object|null>} Updated user object or null if not found
   */
  static async update(id, updates) {
    const allowedFields = ['username', 'email'];
    const updateFields = [];
    const values = [];

    // Build dynamic UPDATE query
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updateFields.length === 0) {
      return null;
    }

    values.push(id);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.getById(id);
  }

  /**
   * Update user password
   * @param {number} id - User ID
   * @param {string} newPassword - New plain text password
   * @returns {Promise<boolean>} True if updated, false if not found
   */
  static async updatePassword(id, newPassword) {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    const [result] = await db.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete a user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Verify password against hash
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
