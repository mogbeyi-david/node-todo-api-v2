const _ = require('lodash')
const mongoose = require('mongoose')
const express = require('express')
const httpStatusCodes = require('http-status-codes')
const auth = require('../middlewares/auth')
const router = express.Router()
const validateTodo = require('../validation/todo')
const User = require('../models/user')
const Todo = require('../models/todo');

router.post('/create', auth, async function (req, res) {
  const {error, value} = validateTodo(req.body)
  if (error) res.status(httpStatusCodes.BAD_REQUEST).send({message: error.details[0].message, data: value})
  const newTodo = new Todo({
    todo: req.body.todo,
    description: req.body.description,
    isComplete: req.body.isComplete,
    completedAt: req.body.completedAt,
    userId: req.user.userId
  })
  const result = await newTodo.save()
  res.status(httpStatusCodes.CREATED).send(result)
})

// Endpoint to get all todos
router.get('/all', async function (req, res) {
  try {
    const todos = await Todo.find({});
    res.status(httpStatusCodes.OK).send(todos)
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

// Endpoint to get a single todo
router.get('/:id', auth, async function (req, res) {
  const todoId = req.params.id
  try {
    const todo = await Todo.find({_id: todoId})
    if (!todo) res.status(httpStatusCodes.NOT_FOUND).send({message: 'No Todos Found'})
    res.status(httpStatusCodes.OK).send(todo)
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

// Endpoint to update a single todo
router.patch('/:id', auth, async function (req, res) {
  const {error, value} = validateTodo(req.body)
  if (error) res.status(httpStatusCodes.BAD_REQUEST).send({message: error.details[0].message, data: value})
  const todoId = req.params.id
  try {
    const getTodo = await Todo.find({_id: todoId})
    if (getTodo.length === 0) res.status(httpStatusCodes.NOT_FOUND).send({message: 'Todo not found'})
    const updateTodo = await Todo.updateOne({_id: todoId}, {
      $set: {
        todo: req.body.todo,
        description: req.body.description,
        isComplete: req.body.isComplete,
        completedAt: req.body.completedAt
      }
    })
    if (!updateTodo) {
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send('Sorry, could not update todo at this time')
    }
    const todo = await Todo.find({_id: todoId})
    res.status(httpStatusCodes.OK).send(todo)
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

// Endpoint to delete a todo
router.delete('/:id', auth, async function (req, res) {
  const todoId = req.params.id
  try {
    const todo = await Todo.find({_id: todoId})
    if (todo.length === 0) res.status(httpStatusCodes.NOT_FOUND).send({message: 'Todo not found'})
    const deleteTodo = await Todo.findByIdAndRemove(todoId)
    if (!deleteTodo) {
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({message: 'Todo could not be deleted at this time'})
    }
    res.status(httpStatusCodes.OK).send({message: 'Todo deleted successfully'})
  } catch (exception) {
    res.status(httpStatusCodes.OK).send(exception.message)
  }
})

router.get('/', auth, async function (req, res) {
  try {
    const userTodos = await Todo.find({userId: req.user.userId});
    if(!userTodos)res.status(httpStatusCodes.NOT_FOUND).send({message: 'No Todos found'})
    res.status(httpStatusCodes.OK).send(userTodos)
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

// Endpoint to get all todos for a user
module.exports = router