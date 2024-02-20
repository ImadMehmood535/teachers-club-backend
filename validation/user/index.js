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

const getAllSchema = Joi.object({
  query: Joi.object({
    type: Joi.string().required(),
    admin: Joi.string(),
  }),
  params: Joi.object({}),
  body: Joi.object({}),
});

const getByIdSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({ userId: Joi.string().required() }),
  body: Joi.object({}),
});

const editUserSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({ userId: Joi.string().required() }),
  body: Joi.object({
    email: Joi.string().email().max(100),
    password: Joi.string().min(8).max(20),
    image: Joi.string(),
    phone: Joi.string(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    city: Joi.string(),
    postal_code: Joi.string(),
    current_institute: Joi.string(),
    address: Joi.string(),
    requirements: Joi.string().min(8),
    requirement_description: Joi.string().min(8),
    requirement_details: Joi.string().min(8),
    is_sponsored: Joi.boolean(),
    is_approved: Joi.boolean(),
    is_featured: Joi.boolean(),
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
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    city: Joi.string().required(),
    postal_code: Joi.string().required(),
    type: Joi.string().valid("teacher", "parent").required(),
    current_institute: Joi.string(),
    address: Joi.string().required(),
  }),
});

module.exports = {
  loginSchema,
  registerSchema,
  getAllSchema,
  getByIdSchema,
  editUserSchema,
};
