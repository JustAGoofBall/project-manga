const request = require('supertest');
const app = require('../index');
const db = require('../config/db');

process.env.NODE_ENV = 'test';

// Helper: Create a user and return auth token + user info
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

describe('Ratings API Endpoints', () => {
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

  // ========== GET RATINGS FOR ANIME ==========
  describe('GET /api/anime/:animeId/ratings', () => {
    test('Should return empty ratings with null average when no ratings exist', async () => {
      const animeId = await createAnime();

      const response = await request(app).get(`/api/anime/${animeId}/ratings`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.average).toBeNull();
      expect(response.body.count).toBe(0);
    });

    test('Should return ratings with correct average', async () => {
      const animeId = await createAnime();
      const { token: token1 } = await createUser(1);
      const { token: token2 } = await createUser(2);

      await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ rating: 8, review: 'Great anime!' });

      await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ rating: 6 });

      const response = await request(app).get(`/api/anime/${animeId}/ratings`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.average).toBe(7.0);
      expect(response.body.count).toBe(2);
      expect(response.body.data[0]).toHaveProperty('username');
    });

    test('Should return 404 for non-existent anime', async () => {
      const response = await request(app).get('/api/anime/9999/ratings');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('Should return 400 for invalid anime ID', async () => {
      const response = await request(app).get('/api/anime/abc/ratings');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== POST RATING ==========
  describe('POST /api/anime/:animeId/ratings', () => {
    test('Should create a rating successfully', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 9, review: 'Excellent!' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Rating created successfully');
      expect(response.body.data.rating).toBe(9);
      expect(response.body.data.review).toBe('Excellent!');
    });

    test('Should create a rating without review', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 7 });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.review).toBeNull();
    });

    test('Should return 401 when not authenticated', async () => {
      const animeId = await createAnime();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .send({ rating: 8 });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('Should return 400 when rating is missing', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Rating is required');
    });

    test('Should return 400 when rating is below 1', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 0 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Rating must be between 1 and 10');
    });

    test('Should return 400 when rating is above 10', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 11 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Rating must be between 1 and 10');
    });

    test('Should return 400 when rating is not an integer', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 7.5 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Rating must be an integer');
    });

    test('Should return 409 when user already rated this anime', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 8 });

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 9 });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    test('Should return 404 for non-existent anime', async () => {
      const { token } = await createUser();

      const response = await request(app)
        .post('/api/anime/9999/ratings')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 8 });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('Should return 400 when review is too long', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 8, review: 'a'.repeat(1001) });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Review must be less than 1000 characters');
    });
  });

  // ========== PUT RATING ==========
  describe('PUT /api/anime/:animeId/ratings/:ratingId', () => {
    test('Should update own rating successfully', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const createRes = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 7, review: 'Good' });

      const ratingId = createRes.body.data.id;

      const response = await request(app)
        .put(`/api/anime/${animeId}/ratings/${ratingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 9, review: 'Actually great!' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Rating updated successfully');
      expect(response.body.data.rating).toBe(9);
      expect(response.body.data.review).toBe('Actually great!');
    });

    test('Should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/api/anime/1/ratings/1')
        .send({ rating: 9 });

      expect(response.status).toBe(401);
    });

    test('Should return 403 when updating another user\'s rating', async () => {
      const animeId = await createAnime();
      const { token: token1 } = await createUser(1);
      const { token: token2 } = await createUser(2);

      const createRes = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ rating: 7 });

      const ratingId = createRes.body.data.id;

      const response = await request(app)
        .put(`/api/anime/${animeId}/ratings/${ratingId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ rating: 9 });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only update your own ratings');
    });

    test('Should return 404 for non-existent rating', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .put(`/api/anime/${animeId}/ratings/9999`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 8 });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Rating not found');
    });

    test('Should return 400 for invalid rating value on update', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const createRes = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 7 });

      const ratingId = createRes.body.data.id;

      const response = await request(app)
        .put(`/api/anime/${animeId}/ratings/${ratingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 15 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== DELETE RATING ==========
  describe('DELETE /api/anime/:animeId/ratings/:ratingId', () => {
    test('Should delete own rating successfully', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const createRes = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 8 });

      const ratingId = createRes.body.data.id;

      const response = await request(app)
        .delete(`/api/anime/${animeId}/ratings/${ratingId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Rating deleted successfully');
    });

    test('Should return 401 when not authenticated', async () => {
      const response = await request(app).delete('/api/anime/1/ratings/1');

      expect(response.status).toBe(401);
    });

    test('Should return 403 when deleting another user\'s rating', async () => {
      const animeId = await createAnime();
      const { token: token1 } = await createUser(1);
      const { token: token2 } = await createUser(2);

      const createRes = await request(app)
        .post(`/api/anime/${animeId}/ratings`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ rating: 7 });

      const ratingId = createRes.body.data.id;

      const response = await request(app)
        .delete(`/api/anime/${animeId}/ratings/${ratingId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only delete your own ratings');
    });

    test('Should return 404 for non-existent rating', async () => {
      const animeId = await createAnime();
      const { token } = await createUser();

      const response = await request(app)
        .delete(`/api/anime/${animeId}/ratings/9999`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== GET /api/ratings/me ==========
  describe('GET /api/ratings/me', () => {
    test('Should return authenticated user\'s ratings', async () => {
      const animeId1 = await createAnime('Naruto');
      const animeId2 = await createAnime('One Piece');
      const { token } = await createUser();

      await request(app)
        .post(`/api/anime/${animeId1}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 10, review: 'Best anime!' });

      await request(app)
        .post(`/api/anime/${animeId2}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 9 });

      const response = await request(app)
        .get('/api/ratings/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('anime_name');
    });

    test('Should return empty array when user has no ratings', async () => {
      const { token } = await createUser();

      const response = await request(app)
        .get('/api/ratings/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('Should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/ratings/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
