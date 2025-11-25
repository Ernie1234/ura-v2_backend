import {
  createSchema,
  emailSchema,
  passwordSchema,
  nameSchema,
  usernameSchema,
  requiredStringSchema,
} from './common.schemas';

export const authSchemas = {
  register: createSchema({
    email: emailSchema,
    password: passwordSchema,
    firstName: nameSchema.label('First name'),
    lastName: nameSchema.label('Last name'),
    username: usernameSchema,
  }),

  login: createSchema({
    email: emailSchema,
    password: requiredStringSchema('Password'),
  }),

  refreshToken: createSchema({
    refreshToken: requiredStringSchema('Refresh token'),
  }),

  forgotPassword: createSchema({
    email: emailSchema,
  }),

  resetPassword: createSchema({
    token: requiredStringSchema('Reset token'),
    password: passwordSchema,
  }),

  changePassword: createSchema({
    currentPassword: requiredStringSchema('Current password'),
    newPassword: passwordSchema.label('New password'),
  }),
};

// Export individual schemas with body wrapper
export const registerSchema = { body: authSchemas.register };
export const loginSchema = { body: authSchemas.login };
export const refreshTokenSchema = { body: authSchemas.refreshToken };
export const forgotPasswordSchema = { body: authSchemas.forgotPassword };
export const resetPasswordSchema = { body: authSchemas.resetPassword };
export const changePasswordSchema = { body: authSchemas.changePassword };
