const httpStatusCodes = require('http-status-codes')

function admin (req, res, next) {
  if(!req.user.isAdmin) return res.status(httpStatusCodes.FORBIDDEN).send({message: 'Access Denied'})
}

module.exports = admin