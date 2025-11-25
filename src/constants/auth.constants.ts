export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
  APPLE: 'apple',
  FACEBOOK: 'facebook',
  GITHUB: 'github',
} as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

export const USER_ROLES = {
  USER: 'user',
  PREMIUM_USER: 'premium_user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
  INVITATION: 'invitation',
} as const;

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export const TOKEN_CONFIG = {
  ACCESS_EXPIRY: '15m',
  REFRESH_EXPIRY: '7d',
  RESET_PASSWORD_EXPIRY: '1h',
  VERIFY_EMAIL_EXPIRY: '24h',
} as const;

export const RATE_LIMITS = {
  LOGIN: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
  REGISTER: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 registrations per hour
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 attempts per hour
  GENERAL: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
} as const;
