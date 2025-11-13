import { Schema, model, Document } from 'mongoose';

export interface ITokenBlacklist extends Document {
  token: string;
  type: 'access' | 'refresh';
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
  {
    token: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['access', 'refresh'], required: true },
    userId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true }, // Remove index: true from here
  },
  { timestamps: true }
);

// Keep only the TTL index
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema);
