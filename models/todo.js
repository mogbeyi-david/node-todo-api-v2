const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  todo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  isComplete: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo
