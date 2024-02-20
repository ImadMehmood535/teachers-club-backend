/** @format */

const Joi = require("joi");

const loginSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(8).max(20).required(),
  }),
});

const registerSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(8).max(20).required(),
    image: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
  }),
});

module.exports = {
  loginSchema,
  registerSchema,
};
