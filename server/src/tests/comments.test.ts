import request from 'supertest';
import app from '../app';
import { signAccessToken } from '../utils/jwt';
import { Role } from '../constants/roles';

describe('Comments API Scenarios', () => {
  const regularUserToken = signAccessToken({
    _id: '6b0005a21443a28aaba724cc',
    name: 'Regular Author',
    email: 'author@test.com',
    role: Role.USER,
  });

  describe('GET /api/v1/posts/:postId/comments', () => {
    it('should return 404 when target post does not exist', async () => {
      const res = await request(app).get('/api/v1/posts/000000000000000000000000/comments');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/posts/:postId/comments (Protected)', () => {
    it('should return 401 Unauthorized when attempting to comment without auth cookie', async () => {
      const res = await request(app)
        .post('/api/v1/posts/6b0005f41443a28aaba724d7/comments')
        .send({ content: 'Anonymous comment attempt' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 422 Unprocessable Entity when comment content is empty string', async () => {
      const res = await request(app)
        .post('/api/v1/posts/6b0005f41443a28aaba724d7/comments')
        .set('Cookie', [`access_token=${regularUserToken}`])
        .send({ content: '' });
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/v1/posts/comments/:id (Protected)', () => {
    it('should return 401 Unauthorized when editing comment without auth', async () => {
      const res = await request(app)
        .put('/api/v1/posts/comments/6b00062a1443a28aaba724e1')
        .send({ content: 'Updated content' });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/posts/comments/:id (Protected)', () => {
    it('should return 401 Unauthorized when deleting comment without auth', async () => {
      const res = await request(app).delete('/api/v1/posts/comments/6b00062a1443a28aaba724e1');
      expect(res.status).toBe(401);
    });
  });
});

