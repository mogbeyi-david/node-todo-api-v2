let server
const request = require('supertest')
const Todo = require('../../models/todo')

describe('/api/todos', () => {
  beforeEach(() => {server = require('../../app')})
  afterEach(async () => {
    server.close()
    await Todo.remove({})
  })

  describe('GET/', () => {
    it('should return all genres', async () => {
      await Todo.collection.insertMany([
        {
          todo: 'first todo',
          description: 'Description for first todo',
          isComplete: false,
          userId: '5c70a1cd68a83e13b39aae46'
        },
        {
          todo: 'Second todo',
          description: 'Description for Second todo',
          isComplete: false,
          userId: '5c70a1cd68a83e13b39aae46'
        },
      ])
      const response = await request(server).get('/api/todo/all')
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(2)
      expect(response.body.some(t => t.todo === 'Second todo')).toBeTruthy()
      expect(response.body.some(t => t.todo === 'first todo')).toBeTruthy()
    })

    it('should return a single todo if a valid ID is passed', async () => {
      const todo = await new Todo({
        todo: 'single todo',
        description: 'Description for first todo',
        isComplete: false,
        userId: '5c70a1cd68a83e13b39aae46'
      })
      await todo.save()
      const response = await request(server).get(`/api/todo/${todo._id}`)
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(1)
      expect(response.body.some(t => t.todo === 'single todo')).toBeTruthy()
    })

    it('should return a 404 error if an invalid ID is passed', async () => {

      const id = '5c70a1cd68a83e13b39aae46'
      const response = await request(server).get(`/api/todo/${id}`)
      expect(response.status).toBe(404)
      expect(response.body.message).toMatch(/No Todos Found/)
    })
  })
})