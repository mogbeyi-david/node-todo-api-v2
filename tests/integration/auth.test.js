let server
const request = require('supertest')
const User = require('../../models/user')
const Todo = require('../../models/todo')

describe('auth middleware', () => {

  beforeEach(() => {server = require('../../app')})
  afterEach(async () => {
    server.close()
    await Todo.remove({})
  })

  let token
  const exec = () => {
    return request(server)
      .post('/api/todo/create')
      .set('x-auth-token', token)
      .send({
        todo: 'to be created todo',
        description: 'Description for first todo',
        isComplete: false
      })
  }

  beforeEach(() => {
    token = new User().generateJsonWebToken()
  })

  it('should return 401 if no token is provided', async () => {
    token = ''
    const response = await exec()
    expect(response.status).toBe(401)
  })

  it('should return 400 if token is invalid', async () => {
    token = null
    const response = await exec()
    expect(response.status).toBe(400)
  })

  it('should return 200 if token is valid', async () => {
    const response = await exec()
    expect(response.status).toBe(201)
  })
})