import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '@/config/env.config';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

const createRotateTransport = (level: string): DailyRotateFile => {
  return new DailyRotateFile({
    level,
    filename: `logs/${level}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
    format: logFormat,
  });
};

const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    level: config.env === 'production' ? 'info' : 'debug',
    format: consoleFormat,
  }),

  // File transports
  createRotateTransport('error'),
  createRotateTransport('warn'),
  createRotateTransport('info'),
];

// Add debug transport only in development
if (config.env === 'development') {
  transports.push(createRotateTransport('debug'));
}

export const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
  exitOnError: false,
});

// Create a stream object with 'write' function for morgan
export const logStream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

// Helper functions for structured logging
export const logError = (error: Error, meta?: Record<string, unknown>): void => {
  logger.error(error.message, {
    stack: error.stack,
    name: error.name,
    ...meta,
  });
};

export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  responseTime: number,
  userId?: string
): void => {
  logger.info('HTTP Request', {
    method,
    url,
    statusCode,
    responseTime,
    userId,
  });
};

export const logAuth = (event: string, userId: string, meta?: Record<string, unknown>): void => {
  logger.info(`Auth: ${event}`, {
    userId,
    ...meta,
  });
};

export const logDatabase = (
  operation: string,
  collection: string,
  meta?: Record<string, unknown>
): void => {
  logger.debug(`DB: ${operation}`, {
    collection,
    ...meta,
  });
};
