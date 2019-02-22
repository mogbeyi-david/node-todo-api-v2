const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema
require('dotenv').config() // pull in dotenv to access enviroment variables

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new Schema({
  name: {
    required: true,
    type: String,
    maxlength: 1024
  },
  email: {
    required: true,
    type: String,
    maxlength: 255,
    trim: true
  },
  password: {
    required: true,
    type: String,
    minlength: 6,
    maxlength: 255
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.Model('User', userSchema) // create the user model

User.methods.generateJsonWebToken = function () {
  return jwt.sign({
    userId: this._id,
    name: this.name,
    email: this.email
  }, JWT_SECRET_KEY)
}

module.exports = User // Export the model class