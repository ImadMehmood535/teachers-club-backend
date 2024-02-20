/** @format */

const Joi = require("joi");

const updateOrderSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    orderId: Joi.number().min(1).required(),
  }),
  body: Joi.object({}),
});

module.exports = {
  updateOrderSchema,
};
