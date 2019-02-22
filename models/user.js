const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

const User = mongoose.Model('User', userSchema); // create the user model

module.exports = User; // Export the model class