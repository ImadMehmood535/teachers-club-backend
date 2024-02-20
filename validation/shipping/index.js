/** @format */

const Joi = require("joi");

const shippingSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(8).max(20).required(),
    image: Joi.string().required(),
    phone: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    type: Joi.string().required(),
    current_institute: Joi.string(),
    address: Joi.string().required(),
  }),
});

module.exports = {
  shippingSchema,
};
