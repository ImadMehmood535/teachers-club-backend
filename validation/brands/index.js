/** @format */

const Joi = require("joi");

const createBrandsSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    name: Joi.string().required(),
  }),
});
const udpateBrandsSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    brandId: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    name: Joi.string().optional(),
  }).min(1),
});

module.exports = { createBrandsSchema, udpateBrandsSchema };
