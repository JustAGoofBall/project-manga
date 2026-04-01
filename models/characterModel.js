const db = require('../config/db');

/**
 * Character Model
 * Handles all database operations for characters
 */
class Character {
  /**
   * Get all characters from a specific anime
   * @param {number} animeId - Anime ID
   * @returns {Promise<Object|null>} Object with anime name and characters, or null if anime not found
   */
  static async getAllByAnime(animeId) {
    const [anime] = await db.query('SELECT name FROM anime WHERE id = ?', [animeId]);

    if (anime.length === 0) {
      return null;
    }

    const [characters] = await db.query(
      'SELECT id, name, anime_id FROM characters WHERE anime_id = ?',
      [animeId]
    );

    return {
      anime: anime[0].name,
      characters
    };
  }

  /**
   * Get a specific character from a specific anime
   * @param {number} animeId - Anime ID
   * @param {number} characterId - Character ID
   * @returns {Promise<Object|null>} Character object with anime name, or null if not found
   */
  static async getById(animeId, characterId) {
    const [anime] = await db.query('SELECT name FROM anime WHERE id = ?', [animeId]);

    if (anime.length === 0) {
      return null;
    }

    const [character] = await db.query(
      'SELECT id, name, anime_id FROM characters WHERE id = ? AND anime_id = ?',
      [characterId, animeId]
    );

    if (character.length === 0) {
      return null;
    }

    return {
      anime: anime[0].name,
      character: character[0]
    };
  }

  /**
   * Create a new character for an anime
   * @param {number} animeId - Anime ID
   * @param {string} name - Character name
   * @returns {Promise<Object|null>} Created character object or null if anime not found
   */
  static async create(animeId, name) {
    // Check if anime exists
    const [anime] = await db.query('SELECT id FROM anime WHERE id = ?', [animeId]);

    if (anime.length === 0) {
      return null;
    }

    const [result] = await db.query(
      'INSERT INTO characters (name, anime_id) VALUES (?, ?)',
      [name, animeId]
    );

    return {
      id: result.insertId,
      name,
      anime_id: parseInt(animeId)
    };
  }

  /**
   * Update a character
   * @param {number} animeId - Anime ID
   * @param {number} characterId - Character ID
   * @param {string} name - New character name
   * @returns {Promise<Object|null>} Updated character object or null if not found
   */
  static async update(animeId, characterId, name) {
    const [result] = await db.query(
      'UPDATE characters SET name = ? WHERE id = ? AND anime_id = ?',
      [name, characterId, animeId]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id: parseInt(characterId),
      name,
      anime_id: parseInt(animeId)
    };
  }

  /**
   * Delete a character
   * @param {number} animeId - Anime ID
   * @param {number} characterId - Character ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(animeId, characterId) {
    const [result] = await db.query(
      'DELETE FROM characters WHERE id = ? AND anime_id = ?',
      [characterId, animeId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Character;
