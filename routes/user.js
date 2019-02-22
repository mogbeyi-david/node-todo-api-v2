const mongoose = require('mongoose')
const express = require('express')
const httpStatusCodes = require('http-status-codes')
const bcrypt = require('bcrypt')

const router = express.Router()
const validateUser = require('../validation/user')
const User = require('../models/user')

router.post('/', function (req, res) {
  const {error, value} = validateUser(req.body)
  if (error) res.status(httpStatusCodes.BAD_REQUEST).send({message: error, data: value})
  res.send(req.body)
})

module.exports = router