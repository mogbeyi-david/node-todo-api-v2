const _ = require('lodash')
const mongoose = require('mongoose')
const express = require('express')
const httpStatusCodes = require('http-status-codes')
const bcrypt = require('bcrypt')

const router = express.Router()
const validateUser = require('../validation/user')
const User = require('../models/user')

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

module.exports = router