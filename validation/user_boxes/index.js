/** @format */
/** @format */

const Joi = require("joi");

const createUserBoxSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    userId: Joi.number().min(1).required(),
    boxId: Joi.number().min(1).required(),
    maxQuantity: Joi.number().min(1).required(),
  }),
});
const updateUserBoxSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    userBoxId: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    max_quantity: Joi.number().min(1),
    donated_quantity: Joi.number().min(1),
  }).min(1),
});

module.exports = {
  createUserBoxSchema,
  updateUserBoxSchema,
};
