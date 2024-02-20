/** @format */

const Joi = require("joi");

const createBoxSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    title: Joi.string().max(250).required(),
    item_name: Joi.string().max(250).required(),
    details: Joi.string().required(),
    price: Joi.number().min(1).required(),
    height: Joi.number().min(1).required(),
    length: Joi.number().min(1).required(),
    width: Joi.number().min(1).required(),
    weight: Joi.number().min(1).required(),
    item_quantity: Joi.number().min(1).required(),
    image: Joi.string().required(),
    is_brand: Joi.boolean().required(),
    type_id: Joi.number().min(1).required(),
  }),
});
const updateBoxSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    boxId: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    title: Joi.string().max(250),
    item_name: Joi.string().max(250),
    details: Joi.string(),
    height: Joi.number().min(1),
    length: Joi.number().min(1),
    width: Joi.number().min(1),
    weight: Joi.number().min(1),
    price: Joi.number().min(1),
    item_quantity: Joi.number().min(1),
    image: Joi.string(),
    is_brand: Joi.boolean(),
    type_id: Joi.number().min(1),
  }).min(1),
});

module.exports = {
  createBoxSchema,
  updateBoxSchema,
};
