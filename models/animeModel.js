const db = require('../config/db');

/**
 * Anime Model
 * Handles all database operations for anime
 */
class Anime {
  /**
   * Get all anime with their characters
   * @returns {Promise<Array>} Array of anime with characters
   */
  static async getAll() {
    const [anime] = await db.query('SELECT * FROM anime');
    
    // Get characters for each anime
    const animeWithCharacters = await Promise.all(
      anime.map(async (a) => {
        const [characters] = await db.query(
          'SELECT id, name FROM characters WHERE anime_id = ?',
          [a.id]
        );
        return { ...a, characters };
      })
    );
    
    return animeWithCharacters;
  }

  /**
   * Get a specific anime by ID with its characters
   * @param {number} id - Anime ID
   * @returns {Promise<Object|null>} Anime object or null if not found
   */
  static async getById(id) {
    const [anime] = await db.query('SELECT * FROM anime WHERE id = ?', [id]);
    
    if (anime.length === 0) {
      return null;
    }
    
    const [characters] = await db.query(
      'SELECT id, name, anime_id FROM characters WHERE anime_id = ?',
      [id]
    );
    
    return { ...anime[0], characters };
  }

  /**
   * Create a new anime
   * @param {string} name - Anime name
   * @returns {Promise<Object>} Created anime object
   */
  static async create(name) {
    const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', [name]);
    
    return {
      id: result.insertId,
      name
    };
  }

  /**
   * Update an anime
   * @param {number} id - Anime ID
   * @param {string} name - New anime name
   * @returns {Promise<Object|null>} Updated anime object or null if not found
   */
  static async update(id, name) {
    const [result] = await db.query(
      'UPDATE anime SET name = ? WHERE id = ?',
      [name, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return {
      id: parseInt(id),
      name
    };
  }

  /**
   * Delete an anime (and its characters due to CASCADE)
   * @param {number} id - Anime ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM anime WHERE id = ?', [id]);
    
    return result.affectedRows > 0;
  }

  /**
   * Search anime by name
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching anime
   */
  static async search(query) {
    const [results] = await db.query(
      'SELECT * FROM anime WHERE name LIKE ?',
      [`%${query}%`]
    );
    
    return results;
  }
}

module.exports = Anime;
