/**
 * The JSON that GET / returns: a hand-written map of every endpoint.
 *
 * This lives in its own file so index.js stays short and shows the shape
 * of the app rather than a wall of documentation text.
 * If you add a route, add a line here too.
 */
module.exports = {
  message: 'Welcome to the Anime Characters API',
  version: '2.0.0',
  endpoints: {
    auth: {
      'POST /api/auth/register': 'Register a new user (body: {username, email, password})',
      'POST /api/auth/login': 'Login user (body: {email, password})',
      'GET /api/auth/me': 'Get current user profile (requires authentication)',
      'PUT /api/auth/me': 'Update current user profile (requires authentication)',
      'DELETE /api/auth/me': 'Delete current user account (requires authentication)'
    },
    anime: {
      'GET /api/anime': 'Get all anime with characters',
      'GET /api/anime/:id': 'Get a specific anime by ID',
      'POST /api/anime': 'Create a new anime (body: {name}) [ADMIN]',
      'PUT /api/anime/:id': 'Update an anime (body: {name}) [ADMIN]',
      'DELETE /api/anime/:id': 'Delete an anime [ADMIN]'
    },
    characters: {
      'GET /api/anime/:animeId/characters': 'Get all characters from an anime',
      'GET /api/anime/:animeId/characters/:characterId': 'Get a specific character',
      'POST /api/anime/:animeId/characters': 'Create a new character (body: {name}) [ADMIN]',
      'PUT /api/anime/:animeId/characters/:characterId': 'Update a character (body: {name}) [ADMIN]',
      'DELETE /api/anime/:animeId/characters/:characterId': 'Delete a character [ADMIN]'
    },
    ratings: {
      'GET /api/anime/:animeId/ratings': 'Get ratings for an anime (includes average score)',
      'POST /api/anime/:animeId/ratings': 'Rate an anime (body: {rating, review?}) [AUTH]',
      'PUT /api/anime/:animeId/ratings/:ratingId': 'Update own rating [AUTH]',
      'DELETE /api/anime/:animeId/ratings/:ratingId': 'Delete own rating [AUTH]',
      'GET /api/ratings/me': 'Get your own ratings [AUTH]'
    },
    favorites: {
      'GET /api/favorites': 'Get your favorites [AUTH]',
      'POST /api/favorites/:animeId': 'Add anime to favorites [AUTH]',
      'DELETE /api/favorites/:animeId': 'Remove anime from favorites [AUTH]'
    },
    admin: {
      'GET /api/admin/users': 'List all users [ADMIN]',
      'PUT /api/admin/users/:id/admin': 'Grant or revoke admin rights (body: {is_admin}) [ADMIN]',
      'DELETE /api/admin/users/:id': 'Delete a user [ADMIN]'
    },
    search: {
      'GET /api/search?q=name': 'Search for anime by name'
    }
  },
  authentication: {
    note: '[AUTH] needs any logged-in user. [ADMIN] needs an admin account.',
    header: 'Authorization: Bearer <your-jwt-token>',
    howTo: '1. Register or login to get a token, 2. Add token to Authorization header'
  }
};
