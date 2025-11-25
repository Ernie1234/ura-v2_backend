import { REGEX_PATTERNS, VALIDATION_RULES } from '@/constants';
import Joi from 'joi';

// Base schemas for reusability
export const emailSchema = Joi.string().email().required().messages({
  'string.email': 'Please provide a valid email address',
  'any.required': 'Email is required',
});

export const passwordSchema = Joi.string()
  .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH)
  .pattern(REGEX_PATTERNS.PASSWORD)
  .required()
  .messages({
    'string.min': `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required',
  });

export const nameSchema = Joi.string()
  .trim()
  .min(VALIDATION_RULES.NAME_MIN_LENGTH)
  .max(VALIDATION_RULES.NAME_MAX_LENGTH)
  .pattern(REGEX_PATTERNS.NAME)
  .required()
  .messages({
    'string.min': `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`,
    'string.max': `Name cannot exceed ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
    'string.pattern.base': 'Name can only contain letters and spaces',
    'any.required': 'Name is required',
  });

export const optionalNameSchema = nameSchema.optional();

export const usernameSchema = Joi.string()
  .trim()
  .min(VALIDATION_RULES.USERNAME_MIN_LENGTH)
  .max(VALIDATION_RULES.USERNAME_MAX_LENGTH)
  .pattern(REGEX_PATTERNS.USERNAME)
  .optional()
  .messages({
    'string.min': `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters long`,
    'string.max': `Username cannot exceed ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters`,
    'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
  });

export const bioSchema = Joi.string()
  .max(VALIDATION_RULES.BIO_MAX_LENGTH)
  .optional()
  .allow('')
  .messages({
    'string.max': `Bio cannot exceed ${VALIDATION_RULES.BIO_MAX_LENGTH} characters`,
  });

export const uriSchema = Joi.string().uri().allow('', null).optional().messages({
  'string.uri': 'Please provide a valid URL',
});

export const requiredStringSchema = (field: string) =>
  Joi.string()
    .required()
    .messages({
      'any.required': `${field} is required`,
      'string.empty': `${field} cannot be empty`,
    });

// Reusable schema factory
export const createSchema = (fields: Joi.SchemaMap) => Joi.object(fields);
