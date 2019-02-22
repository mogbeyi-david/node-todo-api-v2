const Joi = require('joi');

function validateUser (user) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email,
    password: Joi.string().required().min(6).max(255).regex(/^[a-zA-Z0-9]{3,30}$/)
  });
  return Joi.validate(user, schema);
}

module.exports = validateUser