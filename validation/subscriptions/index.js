/** @format */

const Joi = require("joi");

const createSubscriptionSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().required(),
    first_name: Joi.string().max(250).required(),
    last_name: Joi.string().max(250).required(),
    number: Joi.string().required(),
    shipping_cost: Joi.number().min(1).required(),
    cart: Joi.array().required(),
  }),
});

const updateSubscriptionDetailSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    subscriptionDetailId: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    address: Joi.string(),
    city: Joi.string(),
    postal_code: Joi.string(),
  }),
});

module.exports = {
  updateSubscriptionDetailSchema,
  createSubscriptionSchema,
};
