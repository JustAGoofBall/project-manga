const db = require('../config/db');

/**
 * Favorite Model
 * Handles all database operations for favorites
 */
class Favorite {
  /**
   * Get all favorites for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User's favorites with anime names
   */
  static async getByUser(userId) {
    const [favorites] = await db.query(
      `SELECT f.id, f.anime_id, a.name AS anime_name, f.created_at
       FROM favorites f
       JOIN anime a ON f.anime_id = a.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return favorites;
  }

  /**
   * Get a favorite by user and anime (to check for duplicates)
   * @param {number} userId - User ID
   * @param {number} animeId - Anime ID
   * @returns {Promise<Object|null>} Existing favorite or null
   */
  static async getByUserAndAnime(userId, animeId) {
    const [rows] = await db.query(
      'SELECT * FROM favorites WHERE user_id = ? AND anime_id = ?',
      [userId, animeId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Add an anime to favorites
   * @param {number} userId - User ID
   * @param {number} animeId - Anime ID
   * @returns {Promise<Object>} Created favorite
   */
  static async add(userId, animeId) {
    const [result] = await db.query(
      'INSERT INTO favorites (user_id, anime_id) VALUES (?, ?)',
      [userId, animeId]
    );
    return { id: result.insertId, user_id: userId, anime_id: animeId };
  }

  /**
   * Remove an anime from favorites
   * @param {number} userId - User ID
   * @param {number} animeId - Anime ID
   * @returns {Promise<boolean>} True if removed
   */
  static async remove(userId, animeId) {
    const [result] = await db.query(
      'DELETE FROM favorites WHERE user_id = ? AND anime_id = ?',
      [userId, animeId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Favorite;
