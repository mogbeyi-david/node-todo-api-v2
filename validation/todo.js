const Joi = require('joi')

function validateTodo (todo) {
  const schema = {
    todo: Joi.string().required(),
    description: Joi.string(),
    isComplete: Joi.boolean().required()
  }
  return Joi.validate(todo, schema)
}

module.exports = validateTodo