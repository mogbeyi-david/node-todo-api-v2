const mongoose = require('mongoose')
const express = require('express')
const httpStatusCodes = require('http-status-codes')
const bcrypt = require('bcrypt')

const router = express.Router()
const validateUser = require('../validation/user')
const User = require('../models/user');

router.post('/', function (req, res) {
  res.status(httpStatusCodes.OK).send('Good to go');
})

module.exports = router