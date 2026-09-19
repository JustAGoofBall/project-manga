const request = require('supertest');
const app = require('../index');
const db = require('../config/db');
const User = require('../models/userModel');

process.env.NODE_ENV = 'test';

// Helper: register a normal user, return their token and user object.
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

// Helper: register a user, promote them, then log in again so the token
// carries is_admin = 1 (the flag is baked into the token at login time).
async function createAdmin(suffix = `admin_${Date.now()}`) {
  const email = `${suffix}@example.com`;
  const registered = await request(app)
    .post('/api/auth/register')
    .send({ username: suffix, email, password: 'password123' });

  await User.update(registered.body.data.user.id, { is_admin: 1 });

  const loggedIn = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'password123' });

  return { token: loggedIn.body.data.token, user: loggedIn.body.data.user };
}

describe('Admin API Endpoints', () => {
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

  // ========== ACCESS CONTROL ==========
  describe('Access control', () => {
    test('Should return 401 without a token', async () => {
      const response = await request(app).get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('Should return 403 for a logged-in non-admin', async () => {
      const { token } = await createUser();

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Admin access required');
    });
  });

  // ========== LIST USERS ==========
  describe('GET /api/admin/users', () => {
    test('Should list users for an admin', async () => {
      const { token } = await createAdmin();
      await createUser();

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test('Should never expose password hashes', async () => {
      const { token } = await createAdmin();

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      response.body.data.forEach(user => {
        expect(user.password_hash).toBeUndefined();
      });
    });
  });

  // ========== PROMOTE / DEMOTE ==========
  describe('PUT /api/admin/users/:id/admin', () => {
    test('Should promote another user to admin', async () => {
      const { token } = await createAdmin();
      const { user } = await createUser();

      const response = await request(app)
        .put(`/api/admin/users/${user.id}/admin`)
        .set('Authorization', `Bearer ${token}`)
        .send({ is_admin: true });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin status updated');
      expect(response.body.data.is_admin).toBe(1);
    });

    test('Should demote another admin', async () => {
      const { token } = await createAdmin();
      const other = await createAdmin('admin_two');

      const response = await request(app)
        .put(`/api/admin/users/${other.user.id}/admin`)
        .set('Authorization', `Bearer ${token}`)
        .send({ is_admin: false });

      expect(response.status).toBe(200);
      expect(response.body.data.is_admin).toBe(0);
    });

    test('Should refuse to remove your own admin status', async () => {
      const { token, user } = await createAdmin();

      const response = await request(app)
        .put(`/api/admin/users/${user.id}/admin`)
        .set('Authorization', `Bearer ${token}`)
        .send({ is_admin: false });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot remove your own admin status');
    });

    test('Should return 400 when is_admin is not a boolean or 0/1', async () => {
      const { token } = await createAdmin();
      const { user } = await createUser();

      const response = await request(app)
        .put(`/api/admin/users/${user.id}/admin`)
        .set('Authorization', `Bearer ${token}`)
        .send({ is_admin: 'yes' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('is_admin must be a boolean or 0/1');
    });

    test('Should return 400 for a non-numeric user ID', async () => {
      const { token } = await createAdmin();

      const response = await request(app)
        .put('/api/admin/users/abc/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({ is_admin: true });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Should return 404 for a user that does not exist', async () => {
      const { token } = await createAdmin();

      const response = await request(app)
        .put('/api/admin/users/999999/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({ is_admin: true });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  // ========== DELETE USER ==========
  describe('DELETE /api/admin/users/:id', () => {
    test('Should delete another user', async () => {
      const { token } = await createAdmin();
      const { user } = await createUser();

      const response = await request(app)
        .delete(`/api/admin/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');

      const check = await User.getById(user.id);
      expect(check).toBeNull();
    });

    test('Should refuse to delete your own account', async () => {
      const { token, user } = await createAdmin();

      const response = await request(app)
        .delete(`/api/admin/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot delete your own account');
    });

    test('Should return 404 for a user that does not exist', async () => {
      const { token } = await createAdmin();

      const response = await request(app)
        .delete('/api/admin/users/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});
