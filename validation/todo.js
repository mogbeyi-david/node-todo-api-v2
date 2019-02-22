const Joi = require('joi')

function validateTodo (todo) {
  const schema = {
    todo: Joi.string().required(),
    description: Joi.string(),
    isComplete: Joi.boolean().required(),
    userId: Joi.string().required()
  }
  return Joi.validate(user, schema)
}

module.exports = validateTodo