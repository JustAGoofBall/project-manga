const request = require('supertest');
const app = require('../index');
const db = require('../config/db');

// Set test environment
process.env.NODE_ENV = 'test';

describe('Authentication API Endpoints', () => {
  
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
  });

  // Close database connection after all tests
  afterAll(async () => {
    await db.end();
  });

  // ========== REGISTER TESTS ==========
  describe('POST /api/auth/register', () => {
    test('Should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.username).toBe('testuser');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    test('Should return 400 when username is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username is required');
    });

    test('Should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email is required');
    });

    test('Should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is required');
    });

    test('Should return 400 when username is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username must be at least 3 characters long');
    });

    test('Should return 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'invalid-email',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email format');
    });

    test('Should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '12345'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password must be at least 6 characters long');
    });

    test('Should return 409 when email already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      // Try to register again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already in use');
    });

    test('Should return 409 when username already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      // Try to register again with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test2@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username already taken');
    });
  });

  // ========== LOGIN TESTS ==========
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    test('Should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    test('Should return 401 with incorrect email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('Should return 401 with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('Should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email is required');
    });

    test('Should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is required');
    });
  });

  // ========== GET PROFILE TESTS ==========
  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Register and login to get token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      token = response.body.data.token;
    });

    test('Should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.email).toBe('test@example.com');
    });

    test('Should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No authorization token provided');
    });

    test('Should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid token');
    });
  });

  // ========== UPDATE PROFILE TESTS ==========
  describe('PUT /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      token = response.body.data.token;
    });

    test('Should update username successfully', async () => {
      const response = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'newusername'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('newusername');
    });

    test('Should update email successfully', async () => {
      const response = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'newemail@example.com'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('newemail@example.com');
    });

    test('Should return 401 without token', async () => {
      const response = await request(app)
        .put('/api/auth/me')
        .send({
          username: 'newusername'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // ========== PROTECTED ROUTES TESTS ==========
  describe('Protected Routes (POST/PUT/DELETE)', () => {
    let token;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      token = response.body.data.token;
    });

    test('Should allow creating anime with valid token', async () => {
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Naruto'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    test('Should reject creating anime without token', async () => {
      const response = await request(app)
        .post('/api/anime')
        .send({
          name: 'Naruto'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No authorization token provided');
    });

    test('Should reject creating anime with invalid token', async () => {
      const response = await request(app)
        .post('/api/anime')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Naruto'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('Should allow GET requests without token', async () => {
      const response = await request(app)
        .get('/api/anime');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
