import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthenticationError } from '@/utils/errors';

/**
 * Passport JWT authentication middleware
 * Replaces the custom requireAuth middleware
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new AuthenticationError(info?.message || 'Unauthorized'));
    }

    // Attach user to request
    (req as any).user = user;
    next();
  })(req, res, next);
};
