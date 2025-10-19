import Joi from 'joi';
import { VALIDATION_RULES, REGEX_PATTERNS } from '@/config/constants';

// Common validation patterns
const emailSchema = Joi.string().email().required().messages({
  'string.email': 'Please provide a valid email address',
  'any.required': 'Email is required',
});

const passwordSchema = Joi.string()
  .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH)
  .pattern(REGEX_PATTERNS.PASSWORD)
  .required()
  .messages({
    'string.min': `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required',
  });

const nameSchema = Joi.string()
  .trim()
  .min(1)
  .max(VALIDATION_RULES.NAME_MAX_LENGTH)
  .required()
  .messages({
    'string.min': 'Name cannot be empty',
    'string.max': `Name cannot exceed ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
    'any.required': 'Name is required',
  });

const usernameSchema = Joi.string()
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

// Register validation schema
export const registerSchema = {
  body: Joi.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: nameSchema.label('First name'),
    lastName: nameSchema.label('Last name'),
    username: usernameSchema,
  }),
};

// Login validation schema
export const loginSchema = {
  body: Joi.object({
    email: emailSchema,
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),
};

// Refresh token validation schema
export const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required',
    }),
  }),
};

// Forgot password validation schema
export const forgotPasswordSchema = {
  body: Joi.object({
    email: emailSchema,
  }),
};

// Reset password validation schema
export const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Reset token is required',
    }),
    password: passwordSchema,
  }),
};

// Change password validation schema
export const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: passwordSchema.label('New password'),
  }),
};

// Update profile validation schema
export const updateProfileSchema = {
  body: Joi.object({
    firstName: nameSchema.label('First name').optional(),
    lastName: nameSchema.label('Last name').optional(),
    username: usernameSchema,
    bio: Joi.string()
      .max(VALIDATION_RULES.BIO_MAX_LENGTH)
      .optional()
      .allow('')
      .messages({
        'string.max': `Bio cannot exceed ${VALIDATION_RULES.BIO_MAX_LENGTH} characters`,
      }),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field is required for update',
    }),
};
