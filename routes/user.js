const mongoose = require('mongoose');
const express = require('express');
const httpStatusCodes = require('http-status-codes');

const router = express.Router();
const validateUser = require('../validation/user');


module.exports = router