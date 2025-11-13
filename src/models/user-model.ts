import { getRandomCoverImage } from '@/utils/fnLib';
import { Schema, model, Document, Types } from 'mongoose';

// Interface for TypeScript
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for OAuth users
  googleId?: string;
  appleId?: string;
  profilePicture?: string;
  coverImage?: string;
  businessName?: string; // Optional business display name
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string; // TOTP secret (encrypted at rest)
  mfaRecoveryCodes?: string[]; // hashed
  lastLoginAt?: Date;
  bookmarkedBusinesses: Types.ObjectId[]; // Ref 'Business'
  bookmarkedPosts: Types.ObjectId[]; // Changed: Ref 'Post'
  savedEvents: Types.ObjectId[]; // Saved Events
  followingUsers: Types.ObjectId[];
  followingBusinesses: Types.ObjectId[];
  followers: Types.ObjectId[];
  businesses: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // 'select: false' hides it from default queries
    googleId: { type: String, sparse: true, unique: true },
    appleId: { type: String, sparse: true, unique: true },
    profilePicture: { type: String },
    coverImage: {
      type: String,
      default: getRandomCoverImage,
    },
    businessName: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, index: true, select: false },
    emailVerificationExpires: { type: Date, select: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    mfaRecoveryCodes: [{ type: String, select: false }],
    lastLoginAt: { type: Date },
    bookmarkedBusinesses: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    bookmarkedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    savedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    followingUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followingBusinesses: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    businesses: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

export const User = model<IUser>('User', userSchema);
