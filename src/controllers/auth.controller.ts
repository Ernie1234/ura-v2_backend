import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User } from '@/models/user-model';
import { HTTP_STATUS } from '@/config/constants';
import { AuthenticationError, ValidationError } from '@/utils/errors';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateEmailToken,
} from '@/services/token.service';
import { sendVerificationEmail } from '@/services/email.service';
import { asyncHandler } from '@/middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user already exists
  const exists = await User.findOne({ email });
  if (exists) {
    throw new ValidationError('Email already in use');
  }

  // Hash password if provided
  const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

  // Generate email verification token
  const { token, hash, expires } = generateEmailToken();

  // Create user
  await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    emailVerificationToken: hash,
    emailVerificationExpires: expires,
  });

  // Send verification email
  await sendVerificationEmail(email, token);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = String(req.query.token || '');

  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  // Hash the token to compare with stored hash
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with matching token that hasn't expired
  const user = await User.findOne({
    emailVerificationToken: hash,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired verification token');
  }

  // Update user verification status
  user.emailVerified = true;
  user.emailVerificationToken = undefined as unknown as string;
  user.emailVerificationExpires = undefined as unknown as Date;
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Email verified successfully. You can now log in.',
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password, twoFactorCode } = req.body;

  // Find user with password and 2FA secret
  const user = await User.findOne({ email }).select('+password +twoFactorSecret');
  if (!user || !user.password) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Check if email is verified
  if (!user.emailVerified) {
    throw new AuthenticationError('Please verify your email before logging in');
  }

  // Validate 2FA code if enabled
  if (user.twoFactorEnabled) {
    if (!twoFactorCode) {
      throw new AuthenticationError('2FA code required');
    }

    const is2FAValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret as string,
      encoding: 'base32',
      token: twoFactorCode,
      window: 1,
    });

    if (!is2FAValid) {
      throw new AuthenticationError('Invalid 2FA code');
    }
  }

  // Update last login timestamp
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
});

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

export const enable2FA = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as { user: typeof User.prototype }).user;

  if (!user) {
    throw new AuthenticationError('User not authenticated');
  }

  // Generate 2FA secret
  const secret = speakeasy.generateSecret({ name: `URA (${user.email})` });
  const qrDataURL = await QRCode.toDataURL(secret.otpauth_url as string);

  // Save 2FA secret and enable 2FA
  user.twoFactorSecret = secret.base32;
  user.twoFactorEnabled = true;
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: '2FA enabled successfully',
    data: {
      qrDataURL,
      secret: secret.base32,
    },
  });
});

export const disable2FA = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as { user: typeof User.prototype }).user;

  if (!user) {
    throw new AuthenticationError('User not authenticated');
  }

  // Disable 2FA and clear secret
  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined as unknown as string;
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: '2FA disabled successfully',
  });
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  const accessToken = (req as any).token; // Get from auth middleware
  const userId = (req as any).user?.id || (req as any).user?._id;

  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  // Import at top of file
  const { blacklistToken } = await import('@/services/token-blacklist.service');
  const { verifyToken: verify } = await import('@/services/token.service');

  try {
    // Blacklist the access token
    if (accessToken) {
      const decoded = verify(accessToken) as any;
      const expiresAt = new Date(decoded.exp * 1000);
      await blacklistToken(accessToken, 'access', userId.toString(), expiresAt);
    }

    // Blacklist the refresh token if provided
    if (refreshToken) {
      try {
        const decoded = verify(refreshToken, true) as any;
        const expiresAt = new Date(decoded.exp * 1000);
        await blacklistToken(refreshToken, 'refresh', userId.toString(), expiresAt);
      } catch {
        // Refresh token might be invalid, continue anyway
      }
    }
  } catch (error) {
    // Log error but don't fail the logout
    console.error('Error blacklisting tokens:', error);
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
});
