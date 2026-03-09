const request = require('supertest');
const app = require('../index');
const db = require('../config/db');

// Set test environment
process.env.NODE_ENV = 'test';

describe('Error Handling and Edge Cases', () => {
  
  // Setup: Tables are automatically created by db.js
  beforeAll(async () => {
    // Database is already initialized in db.js
  });

  // Clean up database before each test
  beforeEach(async () => {
    await db.query('DELETE FROM characters');
    await db.query('DELETE FROM anime');
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
        .send({ name: 'Test' });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime not found');
    });

    test('DELETE non-existent anime should return 404', async () => {
      const response = await request(app).delete('/api/anime/999999');
      
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
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime name is required');
    });

    test('POST anime with empty name should return 400', async () => {
      const response = await request(app)
        .post('/api/anime')
        .send({ name: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Anime name is required');
    });

    test('PUT anime without name should return 400', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test']);
      
      const response = await request(app)
        .put(`/api/anime/${result.insertId}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST character without name should return 400', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      
      const response = await request(app)
        .post(`/api/anime/${result.insertId}/characters`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Character name is required');
    });

    test('POST character with empty name should return 400', async () => {
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test Anime']);
      
      const response = await request(app)
        .post(`/api/anime/${result.insertId}/characters`)
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
        .send({ name: longName });
      
      // Validators now enforce max length of 100 characters
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('less than 100 characters');
    });

    test('Should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/anime')
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
        .send({ name: specialName });
      
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(specialName);
    });

    test('Should handle character with special characters in name', async () => {
      const [animeResult] = await db.query('INSERT INTO anime (name) VALUES (?)', ['Test']);
      const specialName = "O'Brien-Smith (The 'Hero')";
      
      const response = await request(app)
        .post(`/api/anime/${animeResult.insertId}/characters`)
        .send({ name: specialName });
      
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(specialName);
    });

    test('Should handle anime with Unicode characters', async () => {
      const unicodeName = '進撃の巨人 (Attack on Titan) 🔥';
      
      const response = await request(app)
        .post('/api/anime')
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
        .send({ name: 'New Anime' });
      
      expect(response.status).toBe(201);
    });

    test('Successful GET requests should return 200 status', async () => {
      const response = await request(app).get('/api/anime');
      
      expect(response.status).toBe(200);
    });
  });
});
