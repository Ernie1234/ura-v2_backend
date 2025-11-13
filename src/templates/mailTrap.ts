import { MailtrapClient } from 'mailtrap';

import { logger } from '@/utils/logger';
import { config } from '@/config/env.config';

const TOKEN = config.email.token;

if (!TOKEN) {
  logger.error('Mailtrap token is missing in environment variables');
}

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: 'mailtrap@demomailtrap.com',
  name: 'Ura',
};
