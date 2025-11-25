import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { logger, logError } from '@/utils/logger';
import { config } from '@/config/env.config';
import { IApiResponse, IAuthRequest } from '@/types';
import { HTTP_STATUS } from '@/constants';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const authReq = req as IAuthRequest;

  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: unknown = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details;
  } else if (error.name === 'ValidationError') {
    const err = error as unknown as {
      errors: Record<string, { path: string; message: string }>;
    };

    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';

    details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
  } else if (error.name === 'MongoServerError') {
    const err = error as unknown as {
      code: number;
      keyPattern?: Record<string, unknown>;
    };

    if (err.code === 11000 && err.keyPattern) {
      statusCode = HTTP_STATUS.CONFLICT;
      message = 'Duplicate field value';
      code = 'DUPLICATE_ERROR';

      const field = Object.keys(err.keyPattern)[0];
      details = { field, message: `${field} already exists` };
    }
  } else if (error.name === 'CastError') {
    const err = error as unknown as { path: string; value: unknown };

    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid data format';
    code = 'CAST_ERROR';

    details = {
      field: err.path,
      value: err.value,
    };
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  } else if (error.name === 'MulterError') {
    const err = error as unknown as { code: string };

    statusCode = HTTP_STATUS.BAD_REQUEST;
    code = 'FILE_UPLOAD_ERROR';

    switch (err.code) {
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

  logError(error, {
    statusCode,
    code,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: authReq.user?.id,
  });

  const errorResponse: IApiResponse = {
    success: false,
    message,
    error: { code },
  };

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
