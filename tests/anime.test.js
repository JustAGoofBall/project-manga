const request = require('supertest');
const app = require('../index');
const db = require('../config/db');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Set test environment
process.env.NODE_ENV = 'test';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d';

// Helper function to create a user and get auth token
async function getAuthToken() {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });
  
  return response.body.data.token;
}

// Helper function to create an admin user and get admin auth token
async function getAdminToken() {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: `admin_${Date.now()}`,
      email: `admin_${Date.now()}@example.com`,
      password: 'password123'
    });
  
  const userId = response.body.data.user.id;
  
  // Make the user an admin in the database
  await User.update(userId, { is_admin: 1 });
  
  // Create a new token with is_admin: 1
  const adminToken = jwt.sign(
    { id: userId, username: response.body.data.user.username, email: response.body.data.user.email, is_admin: 1 },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  return adminToken;
}

describe('Anime API Endpoints', () => {
  let authToken;
  
  // Setup: Tables are automatically created by db.js
  beforeAll(async () => {
    // Database is already initialized in db.js
  });

  // Clean up database before each test
  beforeEach(async () => {
    await db.query('DELETE FROM ratings');
    await db.query('DELETE FROM favorites');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM characters');
    await db.query('DELETE FROM anime');
    
    // Get a fresh admin auth token for protected routes
    authToken = await getAdminToken();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await db.end();
  });

  // ========== GET ALL ANIME TESTS ==========
  describe('GET /api/anime', () => {
    test('Should return empty array when no anime exist', async () => {
      const response = await request(app).get('/api/anime');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('Should return all anime with their characters', async () => {
      // Insert test data
      const [anime1] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Naruto']);
      const [anime2] = await db.query('INSERT INTO anime (name) VALUES (?)', ['One Piece']);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Naruto Uzumaki', anime1.insertId]);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Luffy', anime2.insertId]);

      const response = await request(app).get('/api/anime');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('characters');
      expect(response.body.data[0].characters).toHaveLength(1);
    });
  });

  // ========== GET SPECIFIC ANIME TESTS ==========
  describe('GET /api/anime/:id', () => {
    test('Should return specific anime with characters', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Death Note']);
      const animeId = result.insertId;
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Light Yagami', animeId]);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['L', animeId]);

      const response = await request(app).get(`/api/anime/${animeId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Death Note');
      expect(response.body.data.characters).toHaveLength(2);
    });

    test('Should return 404 when anime does not exist', async () => {
      const response = await request(app).get('/api/anime/9999');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });
  });

  // ========== CREATE ANIME TESTS ==========
  describe('POST /api/anime', () => {
    test('Should create new anime successfully', async () => {
      const newAnime = { name: 'Attack on Titan' };
      
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newAnime);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Anime created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Attack on Titan');
    });

    test('Should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime name is required');
    });

    test('Should return 409 when anime name already exists', async () => {
      await db.query('INSERT INTO anime (name) VALUES (?)', ['My Hero Academia']);
      
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'My Hero Academia' });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('An anime with this name already exists');
    });
  });

  // ========== UPDATE ANIME TESTS ==========
  describe('PUT /api/anime/:id', () => {
    test('Should update anime successfully', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Old Name']);
      const animeId = result.insertId;

      const response = await request(app)
        .put(`/api/anime/${animeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'New Name' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Anime updated successfully');
      expect(response.body.data.name).toBe('New Name');
    });

    test('Should return 404 when updating non-existent anime', async () => {
      const response = await request(app)
        .put('/api/anime/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('Should return 400 when name is missing', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      
      const response = await request(app)
        .put(`/api/anime/${result.insertId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== DELETE ANIME TESTS ==========
  describe('DELETE /api/anime/:id', () => {
    test('Should delete anime successfully', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['To Delete']);
      const animeId = result.insertId;

      const response = await request(app)
        .delete(`/api/anime/${animeId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Anime deleted successfully');
    });

    test('Should return 404 when deleting non-existent anime', async () => {
      const response = await request(app)
        .delete('/api/anime/9999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('Should cascade delete characters when anime is deleted', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Cascading Test']);
      const animeId = animeResult.insertId;
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Character 1', animeId]);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Character 2', animeId]);

      await request(app)
        .delete(`/api/anime/${animeId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      const [characters] = await db.query('SELECT * FROM characters WHERE anime_id = ?', [animeId]);
      expect(characters).toHaveLength(0);
    });
  });

  // ========== SEARCH ANIME TESTS ==========
  describe('GET /api/search', () => {
    test('Should search anime by name', async () => {
      await db.query('INSERT INTO anime (name) VALUES (?)', ['Dragon Ball Z']);
      await db.query('INSERT INTO anime (name) VALUES (?)', ['Dragon Ball Super']);
      await db.query('INSERT INTO anime (name) VALUES (?)', ['One Piece']);

      const response = await request(app).get('/api/search?q=Dragon');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    test('Should return empty array when no matches found', async () => {
      await db.query('INSERT INTO anime (name) VALUES (?)', ['Bleach']);

      const response = await request(app).get('/api/search?q=NonExistent');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    test('Should return 400 when search query is missing', async () => {
      const response = await request(app).get('/api/search');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search query is required');
    });
  });
});
