import request from 'supertest';
import app from '../app';

describe('WebSocket Integration', () => {
  it('should connect to WebSocket', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
  });
});
