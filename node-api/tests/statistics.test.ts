/// <reference types="jest" />

import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Helper function to generate a test token
function generateToken(): string {
  return jwt.sign({ userId: 'test-user' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Statistics API', () => {
  describe('POST /api/v1/statistics', () => {
    it('should calculate statistics correctly', async () => {
      const token = generateToken();
      const requestBody = {
        Q: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        R: [
          [1, 2, 3],
          [0, 4, 5],
          [0, 0, 6],
        ],
      };

      const response = await request(app)
        .post('/api/v1/statistics')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(200);

      expect(response.body).toHaveProperty('max');
      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('average');
      expect(response.body).toHaveProperty('sum');
      expect(response.body).toHaveProperty('isDiagonal');
      expect(response.body.isDiagonal).toHaveProperty('Q');
      expect(response.body.isDiagonal).toHaveProperty('R');
    });

    it('should return 401 without token', async () => {
      const requestBody = {
        Q: [[1, 0], [0, 1]],
        R: [[1, 2], [0, 3]],
      };

      await request(app)
        .post('/api/v1/statistics')
        .send(requestBody)
        .expect(401);
    });

    it('should return 400 for invalid request body', async () => {
      const token = generateToken();

      await request(app)
        .post('/api/v1/statistics')
        .set('Authorization', `Bearer ${token}`)
        .send({ Q: 'invalid', R: 'invalid' })
        .expect(400);
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'node-api');
    });
  });
});


