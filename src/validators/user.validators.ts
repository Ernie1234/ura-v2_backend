// src/validations/user.validation.ts
import Joi from 'joi';
import { VALIDATION_RULES, REGEX_PATTERNS } from '@/config/constants';

export const updateProfileSchema = {
  body: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.pattern.base': 'First name can only contain letters and spaces',
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters',
      }),

    lastName: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.pattern.base': 'Last name can only contain letters and spaces',
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters',
      }),

    username: Joi.string()
      .trim()
      .min(VALIDATION_RULES.USERNAME_MIN_LENGTH)
      .max(VALIDATION_RULES.USERNAME_MAX_LENGTH)
      .pattern(REGEX_PATTERNS.USERNAME)
      .optional()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      }),

    bio: Joi.string()
      .max(VALIDATION_RULES.BIO_MAX_LENGTH)
      .optional()
      .allow('')
      .messages({
        'string.max': `Bio cannot exceed ${VALIDATION_RULES.BIO_MAX_LENGTH} characters`,
      }),

    businessName: Joi.string().min(2).max(100).trim().allow('', null).optional(),

    profilePicture: Joi.string().uri().allow('', null).optional(),

    coverImage: Joi.string().uri().allow('', null).optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field is required for update',
    }),
};
