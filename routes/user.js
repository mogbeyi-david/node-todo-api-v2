const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const validateUser = require('../validation/user');


module.exports = router