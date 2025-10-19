import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/services/token.service';
import { AuthenticationError } from '@/utils/errors';
import { User } from '@/models/user-model';

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    if (!token) throw new AuthenticationError('Missing access token');

    const decoded = verifyToken(token) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) throw new AuthenticationError('Invalid token user');

    (req as { user: typeof user }).user = user;
    next();
  } catch {
    next(new AuthenticationError('Unauthorized'));
  }
};
