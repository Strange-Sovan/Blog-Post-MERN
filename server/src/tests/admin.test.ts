import request from 'supertest';
import app from '../app';
import { signAccessToken } from '../utils/jwt';
import { Role } from '../constants/roles';

describe('Admin Panel API & RBAC Scenarios', () => {
  const regularUserToken = signAccessToken({
    _id: '6b0005a21443a28aaba724cc',
    name: 'Regular User',
    email: 'user@test.com',
    role: Role.USER,
  });

  const adminUserToken = signAccessToken({
    _id: '6b0005a21443a28aaba724aa',
    name: 'Super Admin',
    email: 'admin@blogmern.com',
    role: Role.ADMIN,
  });

  describe('GET /api/v1/admin/stats', () => {
    it('Scenario 1: should return 401 Unauthorized when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/admin/stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Scenario 2: should return 403 Forbidden when accessed by regular user (RBAC Enforcement)', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Cookie', [`access_token=${regularUserToken}`]);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Admin access required');
    });

    it('Scenario 3: should return 200 OK with metrics when accessed by Admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Cookie', [`access_token=${adminUserToken}`]);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(typeof res.body.data.totalUsers).toBe('number');
      expect(typeof res.body.data.totalPosts).toBe('number');
      expect(typeof res.body.data.totalComments).toBe('number');
    });
  });

  describe('GET /api/v1/admin/users', () => {
    it('Scenario 1: should return 401 when no auth cookie is provided', async () => {
      const res = await request(app).get('/api/v1/admin/users');
      expect(res.status).toBe(401);
    });

    it('Scenario 2: should return 403 Forbidden for regular users', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Cookie', [`access_token=${regularUserToken}`]);
      expect(res.status).toBe(403);
    });

    it('Scenario 3: should return 200 OK with users array for Admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Cookie', [`access_token=${adminUserToken}`]);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
    });
  });

  describe('GET /api/v1/admin/posts', () => {
    it('Scenario 1: should return 401 when no auth cookie is provided', async () => {
      const res = await request(app).get('/api/v1/admin/posts');
      expect(res.status).toBe(401);
    });

    it('Scenario 2: should return 403 Forbidden for regular users', async () => {
      const res = await request(app)
        .get('/api/v1/admin/posts')
        .set('Cookie', [`access_token=${regularUserToken}`]);
      expect(res.status).toBe(403);
    });

    it('Scenario 3: should return 200 OK with all posts for Admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/posts')
        .set('Cookie', [`access_token=${adminUserToken}`]);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('DELETE /api/v1/admin/users/:id', () => {
    it('Scenario 1: should return 403 Forbidden when regular user attempts to delete a user', async () => {
      const res = await request(app)
        .delete('/api/v1/admin/users/6b0005a21443a28aaba724cc')
        .set('Cookie', [`access_token=${regularUserToken}`]);
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/admin/posts/:id', () => {
    it('Scenario 1: should return 403 Forbidden when regular user attempts admin post deletion', async () => {
      const res = await request(app)
        .delete('/api/v1/admin/posts/6b0005f41443a28aaba724d7')
        .set('Cookie', [`access_token=${regularUserToken}`]);
      expect(res.status).toBe(403);
    });
  });
});

