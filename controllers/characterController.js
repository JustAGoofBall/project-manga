/**
 * Character Controller
 *
 * WHERE THIS SITS IN THE REQUEST FLOW
 *   routes/characters.js  ->  THIS FILE  ->  models/characterModel.js  ->  database
 *
 * Every character belongs to exactly one anime, so all of these routes are
 * nested under an anime: /api/anime/:animeId/characters/...
 * That means we always validate the anime ID as well as the character ID.
 */

const Character = require('../models/characterModel');
const { validateCharacterName, validateCharacterId } = require('../validators/characterValidator');
const { validateAnimeId } = require('../validators/animeValidator');
const sendError = require('../utils/sendError');

/**
 * List every character of one anime.
 * GET /api/anime/:animeId/characters
 */
exports.getCharactersByAnime = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);

    // Returns null when the anime itself does not exist.
    const result = await Character.getAllByAnime(animeId);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    res.json({
      success: true,
      anime: result.anime,
      count: result.characters.length,
      data: result.characters
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Get one character of one anime.
 * GET /api/anime/:animeId/characters/:characterId
 */
exports.getCharacterById = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);
    const characterId = validateCharacterId(req.params.characterId);

    const result = await Character.getById(animeId, characterId);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.json({
      success: true,
      anime: result.anime,
      data: result.character
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Add a character to an anime.
 * POST /api/anime/:animeId/characters      Body: { name: string }
 * Admin only - see routes/characters.js.
 */
exports.createCharacter = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);
    const name = validateCharacterName(req.body.name);

    // Returns null when the parent anime does not exist.
    const character = await Character.create(animeId, name);
    if (!character) {
      return res.status(404).json({ success: false, message: 'Anime not found' });
    }

    res.status(201).json({
      success: true,
      message: 'Character created successfully',
      data: character
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Rename a character.
 * PUT /api/anime/:animeId/characters/:characterId    Body: { name: string }
 * Admin only.
 */
exports.updateCharacter = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);
    const characterId = validateCharacterId(req.params.characterId);
    const name = validateCharacterName(req.body.name);

    const character = await Character.update(animeId, characterId, name);
    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.json({
      success: true,
      message: 'Character updated successfully',
      data: character
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Delete a character.
 * DELETE /api/anime/:animeId/characters/:characterId
 * Admin only.
 */
exports.deleteCharacter = async (req, res) => {
  try {
    const animeId = validateAnimeId(req.params.animeId);
    const characterId = validateCharacterId(req.params.characterId);

    const deleted = await Character.delete(animeId, characterId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.json({ success: true, message: 'Character deleted successfully' });
  } catch (error) {
    sendError(res, error);
  }
};
