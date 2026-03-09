const db = require('../config/db');

/**
 * Rating Model
 * Handles all database operations for ratings
 */
class Rating {
  /**
   * Get all ratings for an anime, including average score
   * @param {number} animeId - Anime ID
   * @returns {Promise<Object>} Ratings array, average, and count
   */
  static async getByAnime(animeId) {
    const [ratings] = await db.query(
      `SELECT r.id, r.user_id, u.username, r.anime_id, r.rating, r.review, r.created_at, r.updated_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.anime_id = ?
       ORDER BY r.created_at DESC`,
      [animeId]
    );

    const [stats] = await db.query(
      'SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE anime_id = ?',
      [animeId]
    );

    const average = stats[0].average
      ? parseFloat(parseFloat(stats[0].average).toFixed(1))
      : null;

    return { ratings, average, count: stats[0].count };
  }

  /**
   * Get a specific rating by ID
   * @param {number} id - Rating ID
   * @returns {Promise<Object|null>} Rating object or null
   */
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM ratings WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get a rating by user and anime (to check for duplicates)
   * @param {number} userId - User ID
   * @param {number} animeId - Anime ID
   * @returns {Promise<Object|null>} Existing rating or null
   */
  static async getByUserAndAnime(userId, animeId) {
    const [rows] = await db.query(
      'SELECT * FROM ratings WHERE user_id = ? AND anime_id = ?',
      [userId, animeId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get all ratings by a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User's ratings with anime names
   */
  static async getByUser(userId) {
    const [ratings] = await db.query(
      `SELECT r.id, r.anime_id, a.name AS anime_name, r.rating, r.review, r.created_at, r.updated_at
       FROM ratings r
       JOIN anime a ON r.anime_id = a.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return ratings;
  }

  /**
   * Create a new rating
   * @param {number} userId - User ID
   * @param {number} animeId - Anime ID
   * @param {number} rating - Rating value (1-10)
   * @param {string|null} review - Optional review text
   * @returns {Promise<Object>} Created rating
   */
  static async create(userId, animeId, rating, review) {
    const [result] = await db.query(
      'INSERT INTO ratings (user_id, anime_id, rating, review) VALUES (?, ?, ?, ?)',
      [userId, animeId, rating, review]
    );
    return { id: result.insertId, user_id: userId, anime_id: animeId, rating, review };
  }

  /**
   * Update a rating
   * @param {number} id - Rating ID
   * @param {number} rating - New rating value
   * @param {string|null} review - New review text
   * @returns {Promise<Object|null>} Updated rating or null
   */
  static async update(id, rating, review) {
    const [result] = await db.query(
      'UPDATE ratings SET rating = ?, review = ? WHERE id = ?',
      [rating, review, id]
    );
    if (result.affectedRows === 0) return null;
    return { id: parseInt(id), rating, review };
  }

  /**
   * Delete a rating
   * @param {number} id - Rating ID
   * @returns {Promise<boolean>} True if deleted
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM ratings WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Rating;
