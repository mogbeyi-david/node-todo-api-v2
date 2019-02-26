const User = require('../../../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const mongoose = require('mongoose')

describe('user.generateJsonWebToken', () => {
  it('should return a valid JSON we token', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: 'zkzk',
      email: 'email@gmail.com',
      isAdmin: true
    }
    const user = new User(payload)
    const token = user.generateJsonWebToken()
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    decoded._id = decoded.userId
    delete decoded.userId
    expect(decoded).toMatchObject(payload)
  })
})