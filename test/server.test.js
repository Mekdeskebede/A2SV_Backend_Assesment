const request = require('supertest');
const server = require('../server');

describe('GET /', () => {
  it('should return Hello, World!', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});
