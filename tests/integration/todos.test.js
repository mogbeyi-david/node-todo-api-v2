let server
const request = require('supertest')

describe('/api/todos', () => {
  beforeEach(() => {server = require('../../app')})
  afterEach(() => {server.close()})

  describe('GET/', () => {
    it('should return all genres', async () => {
      const response = await request(server).get('/api/todo/all')
      expect(response.status).toBe(200)
    })
  })
})