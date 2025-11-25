import nodemailer from 'nodemailer';
import { config } from './env.config';
import { logger } from '@/utils/logger';

// Create reusable transporter with connection pooling
export const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.smtp.user,
    pass: config.email.smtp.pass,
  },
  pool: true, // Enable connection pooling
  maxConnections: 5, // Maximum number of simultaneous connections
  maxMessages: 100, // Maximum messages per connection
  rateDelta: 1000, // Time between messages in milliseconds
  rateLimit: 5, // Maximum messages per rateDelta period
  tls: {
    // Don't fail on invalid certs in development
    rejectUnauthorized: config.email.smtp.env === 'production',
  },
});

transporter.verify((error: Error | null) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('SMTP server is ready to send emails');
  }
});

export const sender = {
  email: config.email.smtp.from.email,
  name: config.email.smtp.from.name,
};
