const _ = require('lodash')
const mongoose = require('mongoose')
const express = require('express')
const httpStatusCodes = require('http-status-codes')
const bcrypt = require('bcrypt')

const router = express.Router()
const validateUser = require('../validation/user')
const User = require('../models/user')

// Endpoint to signup a new user
router.post('/signup', async function (req, res) {
  const {error, value} = validateUser(req.body)
  if (error) res.status(httpStatusCodes.BAD_REQUEST).send({message: error.details[0].message, data: value})
  const user = await User.find({email: req.body.email})
  if (user) res.status(httpStatusCodes.BAD_REQUEST).send({message: 'User already exists', data: req.body})
  const SALT_FACTOR = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, SALT_FACTOR)
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  const result = await newUser.save()
  const response = _.pick(result, ['_id', 'name', 'email'])
  res.status(httpStatusCodes.CREATED).send(response)
})

// Endpoint to get all users
router.get('/all', async function (req, res) {
  try {
    const users = await User.find({}).select('-password')
    res.status(httpStatusCodes.OK).send(users)
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

// Endpoint to get a single user
router.get('/:id', async function (req, res) {
  const userId = req.params.id
  try {
    const user = await User.find({_id: userId}).select('-password')
    if (!user) res.status(httpStatusCodes.BAD_REQUEST).send({message: 'Invalid data supplied'})
    res.status(httpStatusCodes.OK).send(user)
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

router.patch('/:id', async function (req, res) {
  const {error, value} = validateUser(req.body)
  if (error) res.status(httpStatusCodes.BAD_REQUEST).send({message: error.details[0].message, data: value})
  const userId = req.params.id
  try {
    const SALT_FACTOR = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_FACTOR)
    const updateUser = await User.updateOne({_id: userId}, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      }
    })
    if (!updateUser) {
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send('Sorry, could not update user at this time')
    }
    const user = await User.find({_id: userId}).select('-password')
    res.status(httpStatusCodes.OK).send(user)
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

module.exports = router