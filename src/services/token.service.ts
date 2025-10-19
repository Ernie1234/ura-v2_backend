import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '@/config/env.config';

export const generateAccessToken = (payload: object): string => {
  return jwt.sign({ ...payload, type: 'access' }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign({ ...payload, type: 'refresh' }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

export const verifyToken = (token: string, refresh = false): Record<string, unknown> => {
  return jwt.verify(token, refresh ? config.jwt.refreshSecret : config.jwt.secret);
};

export const generateEmailToken = (): { token: string; hash: string; expires: Date } => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, hash, expires };
};
