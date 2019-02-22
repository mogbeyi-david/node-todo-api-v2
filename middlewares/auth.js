const httpStatusCodes = require('http-status-codes')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function auth (req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) return res.status(httpStatusCodes.UNAUTHORIZED).send('No token provided')
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decodedPayload
    next()
  } catch (exception) {
    res.status(httpStatusCodes.BAD_REQUEST).send('Invalid token')
  }
}

module.exports = auth