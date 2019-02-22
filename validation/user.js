const Joi = require('joi')

function validateUser (user) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }
  return Joi.validate(user, schema)
}

module.exports = validateUser