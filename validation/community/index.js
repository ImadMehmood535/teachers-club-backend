/** @format */

const Joi = require("joi");

const createCommunitySchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    picture: Joi.string().required(),
    message: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }),
});
const updateCommunitySchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    communityId: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    picture: Joi.string(),
    message: Joi.string(),
    rating: Joi.number().min(1).max(5),
  }).min(1),
});

const deleteCommunitySchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    communityId: Joi.number().min(1).required(),
  }),
  body: Joi.object({}),
});
module.exports = {
  createCommunitySchema,
  updateCommunitySchema,
  deleteCommunitySchema,
};
