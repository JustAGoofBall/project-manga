/**
 * Favorite Validator
 *
 * A favorite is identified by the anime it points at, so the only thing to
 * check is the anime ID. Reuses the anime validator so the two can never
 * disagree about what a valid ID looks like.
 */

const { validateAnimeId } = require('./animeValidator');

/** Anime ID from POST/DELETE /api/favorites/:animeId */
const validateFavoriteAnimeId = (id) => validateAnimeId(id);

module.exports = { validateFavoriteAnimeId };
