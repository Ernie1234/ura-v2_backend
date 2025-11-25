import { Request, Response } from 'express';
import { User } from '@/models/user-model';

import { AuthenticationError } from '@/utils/errors';
import { asyncHandler } from '@/middleware/errorHandler';
import { HTTP_STATUS } from '@/constants';

export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id || (req as any).user?.userId || (req as any).user?._id;

  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const user = await User.findById(userId).select(
    '-password -emailVerificationToken -emailVerificationExpires -twoFactorSecret -mfaRecoveryCodes'
  );

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  // Aggregate related data
  const { Post } = await import('@/models/post-model');
  const { Business } = await import('@/models/business-model');

  const [posts, businesses] = await Promise.all([
    Post.find({ business: { $in: user.businesses } })
      .sort({ createdAt: -1 })
      .limit(10),
    Business.find({ _id: { $in: user.businesses } }).select(
      'businessName profileImage coverImage followers likes category'
    ),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'User retrieved successfully',
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      businessName: user.businessName,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      lastLoginAt: user.lastLoginAt,
      bookmarkedBusinesses: user.bookmarkedBusinesses,
      bookmarkedPosts: user.bookmarkedPosts,
      savedEvents: user.savedEvents,
      followingUsers: user.followingUsers,
      followingBusinesses: user.followingBusinesses,
      followers: user.followers,
      businesses: user.businesses,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    related: {
      businesses,
      recentPosts: posts,
      counts: {
        posts: await Post.countDocuments({ business: { $in: user.businesses } }),
        followers: user.followers.length,
        following: user.followingUsers.length + user.followingBusinesses.length,
      },
    },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id || (req as any).user?.userId;
  const { firstName, lastName, profilePicture, businessName } = req.body;

  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, profilePicture, businessName },
    { new: true, runValidators: true }
  ).select(
    '-password -emailVerificationToken -emailVerificationExpires -twoFactorSecret -mfaRecoveryCodes'
  );

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});
