import nodemailer from 'nodemailer';
import { config } from '@/config/env.config';
import { logger } from '@/utils/logger';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const from = `URA <${config.email.user}>`;
  await transporter.sendMail({ from, to, subject, html });
};

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `${config.app.url}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`;
  const html = `
    <h2>Verify your email</h2>
    <p>Click the link below to verify your email address:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>This link expires in 24 hours.</p>
  `;
  try {
    await sendEmail(email, 'Verify your email', html);
    logger.info('Verification email sent', { email });
  } catch (err) {
    logger.error('Failed to send verification email', { email, err });
    throw err;
  }
};
