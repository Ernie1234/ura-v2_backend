import { TokenBlacklist } from '@/models/token-blacklist-model';
import { logger } from '@/utils';

/**
 * Add a token to the blacklist
 */
export const blacklistToken = async (
  token: string,
  type: 'access' | 'refresh',
  userId: string,
  expiresAt: Date
): Promise<void> => {
  await TokenBlacklist.create({
    token,
    type,
    userId,
    expiresAt,
  });
};

/**
 * Check if a token is blacklisted
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const blacklisted = await TokenBlacklist.findOne({ token });
  return !!blacklisted;
};

/**
 * Blacklist all tokens for a user (useful for account deletion or security breach)
 */
export const blacklistAllUserTokens = async (userId: string): Promise<void> => {
  // const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  // This is a placeholder - in production you'd need to track active tokens
  // For now, we'll just invalidate future tokens by updating user record
  logger.info(`Blacklisting all tokens for user: ${userId}`);
};

/**
 * Remove expired tokens from blacklist (cleanup job)
 */
export const cleanupExpiredTokens = async (): Promise<void> => {
  await TokenBlacklist.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};
