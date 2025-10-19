import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { logger, logError } from '@/utils/logger';
import { HTTP_STATUS } from '@/config/constants';
import { config } from '@/config/env.config';

export const errorHandler = (error: Error, req: Request, res: Response): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: unknown = undefined;

  // Handle operational errors (AppError instances)
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details;
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
    details = Object.values(
      (error as { errors: Record<string, { path: string; message: string }> }).errors
    ).map((err: { path: string; message: string }) => ({
      field: err.path,
      message: err.message,
    }));
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === 'MongoServerError' && (error as { code: number }).code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'Duplicate field value';
    code = 'DUPLICATE_ERROR';
    const field = Object.keys((error as { keyPattern: Record<string, unknown> }).keyPattern)[0];
    details = { field, message: `${field} already exists` };
  }
  // Handle Mongoose cast errors
  else if (error.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid data format';
    code = 'CAST_ERROR';
    details = {
      field: (error as { path: string }).path,
      value: (error as { value: unknown }).value,
    };
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }
  // Handle Multer errors
  else if (error.name === 'MulterError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    code = 'FILE_UPLOAD_ERROR';
    switch ((error as { code: string }).code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        break;
      default:
        message = 'File upload error';
    }
  }

  // Log the error
  logError(error, {
    statusCode,
    code,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as { user?: { id: string } }).user?.id,
  });

  // Send error response
  const errorResponse: Record<string, unknown> = {
    success: false,
    message,
    error: {
      code,
    },
  };

  // Add details in development mode or for validation errors
  if (config.env === 'development' || statusCode === HTTP_STATUS.BAD_REQUEST) {
    if (details) {
      errorResponse.error.details = details;
    }
    if (config.env === 'development' && error.stack) {
      errorResponse.error.stack = error.stack;
    }
  }

  res.status(statusCode).json(errorResponse);
};

// Handle 404 errors for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  const message = `Route ${req.method} ${req.originalUrl} not found`;
  logger.warn('404 Not Found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message,
    error: {
      code: 'ROUTE_NOT_FOUND',
    },
  });
};

// Async error handler wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
