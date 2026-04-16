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

describe('Character API Endpoints', () => {
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

  // ========== GET ALL CHARACTERS TESTS ==========
  describe('GET /api/anime/:animeId/characters', () => {
    test('Should return all characters for an anime', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Naruto']);
      const animeId = animeResult.insertId;
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Naruto Uzumaki', animeId]);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Sasuke Uchiha', animeId]);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Sakura Haruno', animeId]);

      const response = await request(app).get(`/api/anime/${animeId}/characters`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    test('Should return empty array when anime has no characters', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Empty Anime']);
      const animeId = animeResult.insertId;

      const response = await request(app).get(`/api/anime/${animeId}/characters`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('Should return 404 when anime does not exist', async () => {
      const response = await request(app).get('/api/anime/9999/characters');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });
  });

  // ========== GET SPECIFIC CHARACTER TESTS ==========
  describe('GET /api/anime/:animeId/characters/:characterId', () => {
    test('Should return specific character', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['One Piece']);
      const animeId = animeResult.insertId;
      const [charResult] = await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Monkey D. Luffy', animeId]);
      const characterId = charResult.insertId;

      const response = await request(app).get(`/api/anime/${animeId}/characters/${characterId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Monkey D. Luffy');
      expect(response.body.data.anime_id).toBe(animeId);
    });

    test('Should return 404 when character does not exist', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      const animeId = animeResult.insertId;

      const response = await request(app).get(`/api/anime/${animeId}/characters/9999`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Character not found');
    });

    test('Should return 404 when anime does not exist', async () => {
      const response = await request(app).get('/api/anime/9999/characters/1');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== CREATE CHARACTER TESTS ==========
  describe('POST /api/anime/:animeId/characters', () => {
    test('Should create new character successfully', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Attack on Titan']);
      const animeId = animeResult.insertId;
      const newCharacter = { name: 'Eren Yeager' };

      const response = await request(app)
        .post(`/api/anime/${animeId}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newCharacter);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Character created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Eren Yeager');
    });

    test('Should return 400 when character name is missing', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      const animeId = animeResult.insertId;

      const response = await request(app)
        .post(`/api/anime/${animeId}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Character name is required');
    });

    test('Should return 404 when anime does not exist', async () => {
      const response = await request(app)
        .post('/api/anime/9999/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Character' });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });
  });

  // ========== UPDATE CHARACTER TESTS ==========
  describe('PUT /api/anime/:animeId/characters/:characterId', () => {
    test('Should update character successfully', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Death Note']);
      const animeId = animeResult.insertId;
      const [charResult] = await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Old Name', animeId]);
      const characterId = charResult.insertId;

      const response = await request(app)
        .put(`/api/anime/${animeId}/characters/${characterId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Light Yagami' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Character updated successfully');
      expect(response.body.data.name).toBe('Light Yagami');
    });

    test('Should return 404 when character does not exist', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      const animeId = animeResult.insertId;

      const response = await request(app)
        .put(`/api/anime/${animeId}/characters/9999`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Character not found');
    });

    test('Should return 400 when name is missing', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      const animeId = animeResult.insertId;
      const [charResult] = await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Test', animeId]);

      const response = await request(app)
        .put(`/api/anime/${animeId}/characters/${charResult.insertId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== DELETE CHARACTER TESTS ==========
  describe('DELETE /api/anime/:animeId/characters/:characterId', () => {
    test('Should delete character successfully', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['My Hero Academia']);
      const animeId = animeResult.insertId;
      const [charResult] = await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['To Delete', animeId]);
      const characterId = charResult.insertId;

      const response = await request(app)
        .delete(`/api/anime/${animeId}/characters/${characterId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Character deleted successfully');
    });

    test('Should return 404 when character does not exist', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      const animeId = animeResult.insertId;

      const response = await request(app)
        .delete(`/api/anime/${animeId}/characters/9999`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Character not found');
    });

    test('Should return 404 when anime does not exist', async () => {
      const response = await request(app)
        .delete('/api/anime/9999/characters/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== RELATIONSHIP TESTS ==========
  describe('Character-Anime Relationships', () => {
    test('Should only return characters belonging to specified anime', async () => {
      // Create two anime
      const [anime1] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Anime 1']);
      const [anime2] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Anime 2']);
      
      // Add characters to each
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Char A1', anime1.insertId]);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Char A2', anime1.insertId]);
      await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Char B1', anime2.insertId]);

      const response = await request(app).get(`/api/anime/${anime1.insertId}/characters`);
      
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
      // Check all characters have the correct anime_id
      response.body.data.forEach(char => {
        expect(char.anime_id).toBe(anime1.insertId);
      });
    });

    test('Should verify character belongs to specified anime before operations', async () => {
      const [anime1] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Anime 1']);
      const [anime2] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Anime 2']);
      const [char] = await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', ['Character', anime1.insertId]);

      // Try to access character via wrong anime ID
      const response = await request(app).get(`/api/anime/${anime2.insertId}/characters/${char.insertId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
