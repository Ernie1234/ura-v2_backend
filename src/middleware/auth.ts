import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/services/token.service';
import { AuthenticationError } from '@/utils/errors';
import { User } from '@/models/user-model';
import { isTokenBlacklisted } from '@/services/token-blacklist.service';

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    if (!token) throw new AuthenticationError('Missing access token');

    // Check if token is blacklisted
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) throw new AuthenticationError('Token has been revoked');

    const decoded = verifyToken(token) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) throw new AuthenticationError('Invalid token user');

    // Store both user and token in request
    (req as any).user = user;
    (req as any).token = token;
    next();
  } catch {
    next(new AuthenticationError('Unauthorized'));
  }
};
