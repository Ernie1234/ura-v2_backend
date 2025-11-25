export const VALIDATION_RULES = {
  // Auth
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,

  // Username
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,

  // Names
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,

  // Bio & Descriptions
  BIO_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 1000,

  // Contact
  EMAIL_MAX_LENGTH: 254, // RFC 5321
  PHONE_MAX_LENGTH: 20,

  // URLs
  URL_MAX_LENGTH: 2048,
} as const;

export const REGEX_PATTERNS = {
  // Email (RFC 5322 compliant)
  EMAIL:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

  // Password: at least 1 uppercase, 1 lowercase, 1 number, 1 special character
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,

  // Phone: international format support
  PHONE: /^\+?[\d\s-()]{10,}$/,

  // Username: alphanumeric and underscores only
  USERNAME: /^[a-zA-Z0-9_]+$/,

  // Name: letters, spaces, hyphens, and apostrophes
  NAME: /^[a-zA-Z\s'-]+$/,

  // URL validation
  URL: /^https?:\/\/.+\..+$/,

  // Hex color
  HEX_COLOR: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please provide a valid email address',
  PASSWORD_TOO_WEAK:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  INVALID_USERNAME: 'Username can only contain letters, numbers, and underscores',
  INVALID_NAME: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  FIELD_TOO_LONG: (field: string, max: number) => `${field} cannot exceed ${max} characters`,
  FIELD_TOO_SHORT: (field: string, min: number) =>
    `${field} must be at least ${min} characters long`,
} as const;
