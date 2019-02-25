const mongoose = require('mongoose')
const httpStatusCodes = require('http-status-codes')

function validateObjectId (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(httpStatusCodes.NOT_FOUND).send({message: 'No Todos Found'})
  }
  next();
}

module.exports = validateObjectId;