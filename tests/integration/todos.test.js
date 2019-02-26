let server
const request = require('supertest')
const Todo = require('../../models/todo')
const User = require('../../models/user');

describe('/api/todos', () => {
  beforeEach(() => {server = require('../../app')})
  afterEach(async () => {
    server.close()
    await Todo.remove({})
  })

  describe('GET/', () => {
    it('should return all todos', async () => {
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

  describe('POST/', () => {
    it('should return 401 if client is not logged in', async () => {
      const response = await request(server).post('/api/todo/create').send({
        todo: 'first todo',
        description: 'Description for first todo',
        isComplete: false,
        userId: '5c70a1cd68a83e13b39aae46'
      })
      expect(response.status).toBe(401)
    })
    it('should return 400 if todo does not todo title', async () => {
      const token = (new User()).generateJsonWebToken();
      const response = await request(server)
        .post('/api/todo/create')
        .set('x-auth-token', token)
        .send({
        description: 'Description for first todo',
        isComplete: false
      })
      expect(response.status).toBe(400)
    })
    it('should return 201 and create todo in the database', async () => {
      const token = (new User()).generateJsonWebToken();
      const response = await request(server)
        .post('/api/todo/create')
        .set('x-auth-token', token)
        .send({
          todo: 'to be created todo',
          description: 'Description for first todo',
          isComplete: false
        })
      expect(response).not.toBeNull()
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('_id')
      expect(response.body).toHaveProperty('todo', 'to be created todo')
    })
  })
})