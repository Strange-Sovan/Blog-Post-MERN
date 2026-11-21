import request from 'supertest';
import app from '../app';

describe('Auth API Unit / Integration Tests', () => {
  describe('POST /api/v1/auth/register validation', () => {
    it('should return 422 for missing fields', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({});
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 422 for invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', email: 'invalid-email', password: 'Password123' });
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it('should return 422 for short password without uppercase/digit', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'pass' });
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login validation', () => {
    it('should return 422 for empty login request', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({});
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me protection', () => {
    it('should return 401 when no auth cookie is supplied', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/posts with thumbnail', () => {
    it('should require authentication', async () => {
      const res = await request(app).post('/api/v1/posts');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /health', () => {
    it('should return 200 OK with server health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Server is healthy');
    });
  });

  describe('Swagger Documentation Endpoints', () => {
    it('should serve OpenAPI Swagger JSON specification at /api/v1/docs.json', async () => {
      const res = await request(app).get('/api/v1/docs.json');
      expect(res.status).toBe(200);
      expect(res.body.openapi).toBe('3.0.0');
      expect(res.body.info.title).toBe('MERN Blog System REST API');
      expect(res.body.paths).toBeDefined();
    });

    it('should serve Swagger UI at /docs', async () => {
      const res = await request(app).get('/docs/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Swagger UI');
    });
  });
});
