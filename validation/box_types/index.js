/** @format */

const Joi = require("joi");

const createBoxSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    name: Joi.string().required(),
  }),
});
const updateBoxSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    name: Joi.string().optional(),
  }).min(1),
});

const deleteBoxSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    BoxId: Joi.number().min(1).required(),
  }),
  body: Joi.object({}),
});
module.exports = { createBoxSchema, updateBoxSchema, deleteBoxSchema };
