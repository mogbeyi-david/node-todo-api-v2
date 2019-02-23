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
router.get('/all', auth, async function (req, res) {
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

module.exports = router