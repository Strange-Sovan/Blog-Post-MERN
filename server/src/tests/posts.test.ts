import { promises as fs } from 'fs';
import path from 'path';
import request from 'supertest';
import app from '../app';
import { signAccessToken } from '../utils/jwt';
import { Role } from '../constants/roles';
import { PostModel } from '../models/Post.model';
import { UPLOAD_DIR } from '../middleware/uploadThumbnail';

describe('Posts API Scenarios', () => {
  const regularUserToken = signAccessToken({
    _id: '6b0005a21443a28aaba724cc',
    name: 'Regular Author',
    email: 'author@test.com',
    role: Role.USER,
  });

  describe('GET /api/v1/posts (Public)', () => {
    it('should return 200 with paginated array and pagination metadata', async () => {
      const res = await request(app).get('/api/v1/posts');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(10);
    });

    it('should respect custom page and limit query parameters', async () => {
      const res = await request(app).get('/api/v1/posts?page=2&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.meta.page).toBe(2);
      expect(res.body.meta.limit).toBe(5);
    });
  });

  describe('POST /api/v1/posts (Protected)', () => {
    it('should return 401 Unauthorized when no auth cookie is provided', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .send({ title: 'Unauthorized Post', content: 'This should fail authentication.' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 422 Unprocessable Entity when title is too short (< 3 chars)', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Cookie', [`access_token=${regularUserToken}`])
        .send({ title: 'Hi', content: 'Valid content that is long enough.' });
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 422 Unprocessable Entity when content is too short (< 10 chars)', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Cookie', [`access_token=${regularUserToken}`])
        .send({ title: 'Valid Article Title', content: 'Short' });
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it('should create a post and save its thumbnail in the same multipart request', async () => {
      const image = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l2cAAAAASUVORK5CYII=',
        'base64'
      );
      const title = `Multipart thumbnail ${Date.now()}`;
      let postId = '';
      let storedFile = '';

      try {
        const response = await request(app)
          .post('/api/v1/posts')
          .set('Cookie', [`access_token=${regularUserToken}`])
          .field('title', title)
          .field('content', 'This story and its thumbnail are sent together.')
          .attach('thumbnail', image, { filename: 'cover.png', contentType: 'image/png' });

        expect(response.status).toBe(201);
        postId = response.body.data._id as string;
        const thumbnailUrl = response.body.data.thumbnailUrl as string;
        expect(thumbnailUrl).toMatch(/^\/api\/v1\/uploads\/.+\.png$/);

        storedFile = path.join(UPLOAD_DIR, path.basename(thumbnailUrl));
        expect(await fs.readFile(storedFile)).toEqual(image);

        const imageResponse = await request(app).get(thumbnailUrl);
        expect(imageResponse.status).toBe(200);
        expect(imageResponse.headers['content-type']).toMatch(/image\/png/);
        expect(imageResponse.body).toEqual(image);
      } finally {
        if (postId) await PostModel.findByIdAndDelete(postId);
        if (storedFile) await fs.rm(storedFile, { force: true });
      }
    });
  });

  describe('GET /api/v1/posts/:slug (Public)', () => {
    it('should return 404 Not Found for non-existent post slug', async () => {
      const res = await request(app).get('/api/v1/posts/non-existent-article-slug-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/posts/:id (Protected)', () => {
    it('should return 401 Unauthorized without auth cookie', async () => {
      const res = await request(app)
        .put('/api/v1/posts/6b0005f41443a28aaba724d7')
        .send({ title: 'Updated Title' });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/posts/:id (Protected & RBAC/Ownership)', () => {
    it('should return 401 Unauthorized without auth cookie', async () => {
      const res = await request(app).delete('/api/v1/posts/6b0005f41443a28aaba724d7');
      expect(res.status).toBe(401);
    });
  });
});
