import { celebrate, Joi, Segments } from "celebrate";
import type { RequestHandler } from "express";

export const getProductsValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    q: Joi.string().optional(),
    search: Joi.string().allow("").optional(),
    brandName: Joi.string().allow("").optional(),
    categoryName: Joi.string().allow("").optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid("ASC", "DESC", "asc", "desc").optional(),
  }),
});

export const createProductValidation = celebrate({
  [Segments.BODY]: Joi.object({
    productName: Joi.string().required().min(1),
    brand: Joi.string().required().min(5),
    category: Joi.string().required().min(5),
    price: Joi.number().positive().required(),
    address: Joi.string().allow("").optional(),
    image: Joi.string().allow("").optional(),
  }),
});

export const registerValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
  }),
});

export const loginValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});
