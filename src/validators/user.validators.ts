import Joi from 'joi';
import {
  createSchema,
  optionalNameSchema,
  usernameSchema,
  bioSchema,
  uriSchema,
} from './common.schemas';

const userProfileFields = {
  firstName: optionalNameSchema.label('First name').messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
  }),

  lastName: optionalNameSchema.label('Last name').messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters',
  }),

  username: usernameSchema,

  bio: bioSchema,

  businessName: Joi.string().min(2).max(100).trim().allow('', null).optional().messages({
    'string.min': 'Business name must be at least 2 characters long',
    'string.max': 'Business name cannot exceed 100 characters',
  }),

  profilePicture: uriSchema.label('Profile picture'),

  coverImage: uriSchema.label('Cover image'),
};

export const userSchemas = {
  updateProfile: createSchema(userProfileFields).min(1).messages({
    'object.min': 'At least one field is required for update',
  }),
};

export const updateProfileSchema = { body: userSchemas.updateProfile };
