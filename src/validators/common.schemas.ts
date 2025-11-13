import Joi from 'joi';
import { VALIDATION_RULES, REGEX_PATTERNS } from '@/config/constants';

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
  .min(2)
  .max(50)
  .pattern(/^[a-zA-Z\s]+$/)
  .messages({
    'string.pattern.base': 'Name can only contain letters and spaces',
  });
