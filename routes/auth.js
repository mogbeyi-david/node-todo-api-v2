const _ = require('lodash')
const Joi = require('joi')
const mongoose = require('mongoose')
const express = require('express')
const httpStatusCodes = require('http-status-codes')
const bcrypt = require('bcrypt')

const router = express.Router()
const User = require('../models/user')

router.post('/', async function (req, res) {
  const {error, value} = validateUserDetails(req.body)
  if (error) res.status(httpStatusCodes.BAD_REQUEST).send({message: error.details[0].message, data: value})
  const user = await User.findOne({email: req.body.email})
  if (!user) res.status(httpStatusCodes.BAD_REQUEST).send({message: 'Invalid Email or Password', data: req.body})
  try {
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) res.status(httpStatusCodes.BAD_REQUEST).send({
      message: 'Invalid Email or Password',
      data: req.body
    })
    const token = user.generateJsonWebToken()
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))
  } catch (exception) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(exception.message)
  }
})

function validateUserDetails (user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }
  return Joi.validate(user, schema)
}

module.exports = router