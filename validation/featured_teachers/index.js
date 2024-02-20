/** @format */

const Joi = require("joi");

const createFeaturedSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    teacher_id: Joi.number().min(1).required(),
  }),
});
const updateFeaturedSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    featuredId: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    teacher_id: Joi.number().min(1).required(),
  }),
});

module.exports = {
  updateFeaturedSchema,
  createFeaturedSchema,
};
