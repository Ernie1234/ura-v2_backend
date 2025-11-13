/**
 * Email Service
 *
 * This service re-exports all email functions from the templates/emails.ts module.
 * Using Mailtrap for development/testing.
 *
 * For production:
 * - Replace Mailtrap with a production email service (SendGrid, AWS SES, Postmark, etc.)
 * - Update the mailtrapClient in templates/mailTrap.ts
 */

export {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWorkspaceInvitationEmail,
} from '@/templates/emails';
