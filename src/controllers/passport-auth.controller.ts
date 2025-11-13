import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { User } from '@/models/user-model';
import { HTTP_STATUS } from '@/config/constants';
import { AuthenticationError, ValidationError } from '@/utils/errors';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyToken,
} from '@/services/token.service';
import { sendVerificationEmail } from '@/services/email.service';
import { asyncHandler } from '@/middleware/errorHandler';
import { blacklistToken } from '@/services/token-blacklist.service';
import { config } from '@/config/env.config';

/**
 * Register new user (Local)
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ValidationError('Email already in use');
  }

  const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
  const { token, hash, expires } = generateEmailToken();

  await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    emailVerificationToken: hash,
    emailVerificationExpires: expires,
  });

  await sendVerificationEmail(email, token);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
  });
});

/**
 * Login with email/password (Local Strategy)
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    passport.authenticate('local', { session: false }, async (err: Error, user: any, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        throw new AuthenticationError(info?.message || 'Invalid credentials');
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            businessName: user.businessName,
          },
        },
      });
    })(req, res, next);
  }
);

/**
 * Google OAuth - Initiate
 */
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

/**
 * Google OAuth - Callback
 */
export const googleCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    passport.authenticate('google', { session: false }, async (err: Error, user: any) => {
      if (err || !user) {
        return res.redirect(`${config.frontend.url}/auth/login?error=oauth_failed`);
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      // Redirect to frontend with tokens (or use a success page)
      res.redirect(
        `${config.frontend.url}/auth/oauth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    })(req, res, next);
  }
);

/**
 * Refresh token
 */
export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  try {
    const decoded = verifyToken(refreshToken, true) as { userId: string; email: string };
    const accessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
});

/**
 * Logout with token blacklisting
 */
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  const user = (req as any).user;
  const accessToken = (user as any)?.token;

  if (!user) {
    throw new AuthenticationError('User not authenticated');
  }

  try {
    // Blacklist the access token
    if (accessToken) {
      const decoded = verifyToken(accessToken) as any;
      const expiresAt = new Date(decoded.exp * 1000);
      await blacklistToken(accessToken, 'access', user.id, expiresAt);
    }

    // Blacklist the refresh token if provided
    if (refreshToken) {
      try {
        const decoded = verifyToken(refreshToken, true) as any;
        const expiresAt = new Date(decoded.exp * 1000);
        await blacklistToken(refreshToken, 'refresh', user.id, expiresAt);
      } catch {
        // Refresh token might be invalid, continue anyway
      }
    }
  } catch (error) {
    console.error('Error blacklisting tokens:', error);
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * Verify email
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = String(req.query.token || '');

  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  const crypto = await import('crypto');
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hash,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired verification token');
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined as unknown as string;
  user.emailVerificationExpires = undefined as unknown as Date;
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Email verified successfully. You can now log in.',
  });
});
