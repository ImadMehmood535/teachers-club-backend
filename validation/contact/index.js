/** @format */

const Joi = require("joi");

const contactSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    name: Joi.string().max(250).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().max(255).required(),
    message: Joi.string().required(),
  }),
});
module.exports = { contactSchema };
