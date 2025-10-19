import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
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

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return next(new ValidationError('Email already in use'));

    const hashed = password ? await bcrypt.hash(password, 12) : undefined;
    const { token, hash, expires } = generateEmailToken();

    await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      emailVerificationToken: hash,
      emailVerificationExpires: expires,
    });
    await sendVerificationEmail(email, token);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: 'Registered. Please verify email.' });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = String(req.query.token || '');
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hash,
      emailVerificationExpires: { $gt: new Date() },
    });
    if (!user) return next(new ValidationError('Invalid or expired verification token'));

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(HTTP_STATUS.OK).json({ success: true, message: 'Email verified' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, twoFactorCode } = req.body;
    const user = await User.findOne({ email }).select('+password +twoFactorSecret');
    if (!user || !user.password) return next(new AuthenticationError('Invalid credentials'));

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return next(new AuthenticationError('Invalid credentials'));

    // If 2FA enabled, validate code
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) return next(new AuthenticationError('2FA code required'));
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret as string,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1,
      });
      if (!verified) return next(new AuthenticationError('Invalid 2FA code'));
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: 'Logged in', data: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const decoded = verifyToken(refreshToken, true) as { userId: string; email: string };
    const accessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email });
    res.status(HTTP_STATUS.OK).json({ success: true, data: { accessToken } });
  } catch {
    next(new AuthenticationError('Invalid refresh token'));
  }
};

export const enable2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as { user: typeof User.prototype }).user;
    const secret = speakeasy.generateSecret({ name: `URA (${user.email})` });
    const qrDataURL = await QRCode.toDataURL(secret.otpauth_url as string);

    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = true;
    await user.save();

    res.status(HTTP_STATUS.OK).json({ success: true, data: { qrDataURL, secret: secret.base32 } });
  } catch (err) {
    next(err);
  }
};

export const disable2FA = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as { user: typeof User.prototype }).user;
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();
    res.status(HTTP_STATUS.OK).json({ success: true, message: '2FA disabled' });
  } catch (err) {
    next(err);
  }
};
