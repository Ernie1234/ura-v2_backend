import { config } from '@/config/env.config';
import { logger } from '@/utils/logger';
import { transporter, sender } from '@/config/nodemailer';
import {
  passwordResetRequestTemplate,
  passwordResetSuccessTemplate,
  verificationEmailTemplate,
  workspaceInvitationTemplate,
} from './email-templates';

const baseUrl = config.app.url;

// Define recipient type
interface Recipient {
  email: string;
}

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
): Promise<void> => {
  const verificationLink = `${baseUrl}/verify-email?email=${email}&token=${verificationToken}`;
  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: 'Verify your email',
      html: verificationEmailTemplate
        .replace('{verificationCode}', verificationToken)
        .replace('{verificationLink}', `${verificationLink}`),
    });

    logger.info('Verification email sent successfully', { messageId: info.messageId });
  } catch (error) {
    logger.error('Error sending verification email', error);
    throw new Error(`Error sending verification email: ${(error as Error).message}`);
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: 'Welcome to Team Task!',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for joining Team Task. We're excited to have you on board!</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      `,
    });

    logger.info('Welcome email sent successfully', { messageId: info.messageId });
  } catch (error) {
    logger.error('Error sending welcome email', error);
    throw new Error(`Error sending welcome email: ${(error as Error).message}`);
  }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: 'Reset your password',
      html: passwordResetRequestTemplate.replace('{resetURL}', resetURL),
    });

    logger.info('Password reset email sent successfully', { messageId: info.messageId });
  } catch (error) {
    logger.error('Error sending password reset email', error);
    throw new Error(`Error sending password reset email: ${(error as Error).message}`);
  }
};

// Function to send a password reset success email
export const sendResetSuccessEmail = async (email: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: 'Password Reset Successful',
      html: passwordResetSuccessTemplate,
    });

    logger.info('Password reset success email sent successfully', { messageId: info.messageId });
  } catch (error) {
    logger.error('Error sending password reset success email', error);
    throw new Error(`Error sending password reset success email: ${(error as Error).message}`);
  }
};

export const sendWorkspaceInvitationEmail = async (
  email: string,
  inviterName: string,
  workspaceName: string,
  inviteURL: string
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "You've been invited to join a Team Task workspace!",
      html: workspaceInvitationTemplate
        .replace('{inviterName}', inviterName)
        .replace('{workspaceName}', workspaceName)
        .replace('{inviteURL}', inviteURL),
    });

    logger.info('Workspace invitation email sent successfully', { messageId: info.messageId });
  } catch (error) {
    logger.error('Error sending workspace invitation email', error);
    throw new Error(`Error sending workspace invitation email: ${(error as Error).message}`);
  }
};
