const request = require('supertest');
const app = require('../index');
const db = require('../config/db');

process.env.NODE_ENV = 'test';

// Helper: Create a user and return auth token
async function createUser(suffix = Date.now()) {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: `user_${suffix}`,
      email: `user_${suffix}@example.com`,
      password: 'password123'
    });
  return { token: response.body.data.token, user: response.body.data.user };
}

// Helper: Create an anime and return its ID
async function createAnime(name = 'Naruto') {
  const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', [name]);
  return result.insertId;
}

describe('Favorites API Endpoints', () => {
  beforeEach(async () => {
    await db.query('DELETE FROM ratings');
    await db.query('DELETE FROM favorites');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM characters');
    await db.query('DELETE FROM anime');
  });

  afterAll(async () => {
    await db.end();
  });

  // ========== GET FAVORITES ==========
  describe('GET /api/favorites', () => {
    test('Should return empty favorites list for new user', async () => {
      const { token } = await createUser();

      const response = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('Should return user\'s favorites with anime names', async () => {
      const animeId1 = await createAnime('Naruto');
      const animeId2 = await createAnime('One Piece');
      const { token } = await createUser();

      await request(app)
        .post(`/api/favorites/${animeId1}`)
        .set('Authorization', `Bearer ${token}`);

      await request(app)
        .post(`/api/favorites/${animeId2}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('anime_name');
      expect(response.body.data[0]).toHaveProperty('anime_id');
    });

    test('Should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/favorites');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('Should only return favorites for the authenticated user', async () => {
      const animeId1 = await createAnime('Naruto');
      const animeId2 = await createAnime('One Piece');
      const { token: token1 } = await createUser(1);
      const { token: token2 } = await createUser(2);

      await request(app)
        .post(`/api/favorites/${animeId1}`)
        .set('Authorization', `Bearer ${token1}`);

      await request(app)
        .post(`/api/favorites/${animeId2}`)
        .set('Authorization', `Bearer ${token2}`);

      const response = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].anime_id).toBe(animeId1);
    });
  });

  // ========== POST FAVORITE ==========
  describe('POST /api/favorites/:animeId', () => {
    test('Should add anime to favorites successfully', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Added to favorites');
      expect(response.body.data.anime_id).toBe(animeId);
    });

    test('Should return 401 when not authenticated', async () => {
      const animeId = await createAnime();

      const response = await request(app).post(`/api/favorites/${animeId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('Should return 404 when anime does not exist', async () => {
      const { token } = await createUser();

      const response = await request(app)
        .post('/api/favorites/9999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('Should return 409 when anime is already favorited', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      await request(app)
        .post(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .post(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime is already in your favorites');
    });

    test('Should return 400 for invalid anime ID', async () => {
      const { token } = await createUser();

      const response = await request(app)
        .post('/api/favorites/abc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== DELETE FAVORITE ==========
  describe('DELETE /api/favorites/:animeId', () => {
    test('Should remove anime from favorites successfully', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      await request(app)
        .post(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .delete(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Removed from favorites');
    });

    test('Should return 401 when not authenticated', async () => {
      const response = await request(app).delete('/api/favorites/1');

      expect(response.status).toBe(401);
    });

    test('Should return 404 when anime is not in favorites', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .delete(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime is not in your favorites');
    });

    test('Should not remove another user\'s favorite', async () => {
      const animeId = await createAnime();
      const { token: token1 } = await createUser(1);
      const { token: token2 } = await createUser(2);

      await request(app)
        .post(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token1}`);

      const response = await request(app)
        .delete(`/api/favorites/${animeId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('Should return 400 for invalid anime ID', async () => {
      const { token } = await createUser();

      const response = await request(app)
        .delete('/api/favorites/abc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Should correctly update favorites count after removal', async () => {
      const animeId1 = await createAnime('Naruto');
      const animeId2 = await createAnime('One Piece');
      const { token } = await createUser();

      await request(app).post(`/api/favorites/${animeId1}`).set('Authorization', `Bearer ${token}`);
      await request(app).post(`/api/favorites/${animeId2}`).set('Authorization', `Bearer ${token}`);
      await request(app).delete(`/api/favorites/${animeId1}`).set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].anime_id).toBe(animeId2);
    });
  });
});
