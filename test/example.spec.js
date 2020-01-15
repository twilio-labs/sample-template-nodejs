const supertest = require('supertest');
const app = require('../server');
const agent = supertest(app);

describe('appointment', () => {
  describe('GET /', () => {
    test('returns index.html', async () => {
      const response = await agent.get('/');

      expect(response.text).toContain('Template App');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /example', () => {
    test('returns example data', async () => {
      const response = await agent.get('/example');

      expect(JSON.parse(response.text)).toEqual({
        example: true,
      });
      expect(response.status).toBe(200);
    });
  });
});
