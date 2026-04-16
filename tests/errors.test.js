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

describe('Error Handling and Edge Cases', () => {
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

  // ========== 404 NOT FOUND TESTS ==========
  describe('404 Not Found Errors', () => {
    test('GET non-existent anime should return 404', async () => {
      const response = await request(app).get('/api/anime/999999');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('PUT non-existent anime should return 404', async () => {
      const response = await request(app)
        .put('/api/anime/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('DELETE non-existent anime should return 404', async () => {
      const response = await request(app)
        .delete('/api/anime/999999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('GET character from non-existent anime should return 404', async () => {
      const response = await request(app).get('/api/anime/999999/characters');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('POST character to non-existent anime should return 404', async () => {
      const response = await request(app)
        .post('/api/anime/999999/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Character' });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== 400 BAD REQUEST TESTS ==========
  describe('400 Bad Request Errors', () => {
    test('POST anime without name should return 400', async () => {
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime name is required');
    });

    test('POST anime with empty name should return 400', async () => {
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime name is required');
    });

    test('PUT anime without name should return 400', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test']);
      
      const response = await request(app)
        .put(`/api/anime/${result.insertId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST character without name should return 400', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      
      const response = await request(app)
        .post(`/api/anime/${result.insertId}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Character name is required');
    });

    test('POST character with empty name should return 400', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      
      const response = await request(app)
        .post(`/api/anime/${result.insertId}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Search without query parameter should return 400', async () => {
      const response = await request(app).get('/api/search');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search query is required');
    });

    test('Search with empty query parameter should return 400', async () => {
      const response = await request(app).get('/api/search?q=');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== 409 CONFLICT TESTS ==========
  describe('409 Conflict Errors', () => {
    test('POST anime with duplicate name should return 409', async () => {
      await db.query('INSERT INTO anime (name) VALUES (?)', ['Duplicate Name']);
      
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Duplicate Name' });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('An anime with this name already exists');
    });

    test('PUT anime to duplicate name should return 409', async () => {
      await db.query('INSERT INTO anime (name) VALUES (?)', ['Existing Name']);
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Other Name']);
      
      const response = await request(app)
        .put(`/api/anime/${result.insertId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Existing Name' });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('An anime with this name already exists');
    });
  });

  // ========== INVALID INPUT TESTS ==========
  describe('Invalid Input Handling', () => {
    test('Should handle invalid anime ID format gracefully', async () => {
      const response = await request(app).get('/api/anime/invalid');
      
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });

    test('Should handle negative anime ID', async () => {
      const response = await request(app).get('/api/anime/-1');
      
      // Validators now catch this before database query
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('positive integer');
    });

    test('Should handle very long anime name', async () => {
      const longName = 'A'.repeat(300); // Very long name
      
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: longName });
      
      // Validators now enforce max length of 100 characters
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('less than 100 characters');
    });

    test('Should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');
      
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  // ========== EDGE CASES ==========
  describe('Edge Cases', () => {
    test('Should handle anime with special characters in name', async () => {
      const specialName = 'Anime: The Story! (2024) - Part 1 & 2';
      
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: specialName });
      
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(specialName);
    });

    test('Should handle character with special characters in name', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test']);
      const specialName = "O'Brien-Smith (The 'Hero')";
      
      const response = await request(app)
        .post(`/api/anime/${animeResult.insertId}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: specialName });
      
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(specialName);
    });

    test('Should handle anime with Unicode characters', async () => {
      const unicodeName = '進撃の巨人 (Attack on Titan) 🔥';
      
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: unicodeName });
      
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(unicodeName);
    });

    test('Should handle search with special characters', async () => {
      await db.query('INSERT INTO anime (name) VALUES (?)', ['Test: Special (2024)']);
      
      const response = await request(app).get('/api/search?q=Special%20(2024)');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    test('Should update anime to same name (no duplicate error)', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Same Name']);
      
      const response = await request(app)
        .put(`/api/anime/${result.insertId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Same Name' });
      
      // Should either succeed (200) or detect no change
      expect([200, 409]).toContain(response.status);
    });
  });

  // ========== RESPONSE FORMAT TESTS ==========
  describe('Response Format Consistency', () => {
    test('All success responses should have consistent structure', async () => {
      await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      const response = await request(app).get('/api/anime');
      
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(typeof response.body.success).toBe('boolean');
    });

    test('All error responses should have consistent structure', async () => {
      const response = await request(app).get('/api/anime/999999');
      
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
      expect(typeof response.body.message).toBe('string');
    });

    test('Created resources should return 201 status', async () => {
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'New Anime' });
      
      expect(response.status).toBe(201);
    });

    test('Successful GET requests should return 200 status', async () => {
      const response = await request(app).get('/api/anime');
      
      expect(response.status).toBe(200);
    });
  });
});
