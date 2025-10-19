// review.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  reviewedItem: Types.ObjectId; // Ref to Business OR Post
  reviewedItemModel: 'Business' | 'Post'; // Tells Mongoose which model to 'ref'
  user: Types.ObjectId; // Ref to User
  rating: number; // 1-5
  comment?: string;
}

const reviewSchema = new Schema<IReview>(
  {
    // Polymorphic association
    reviewedItem: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'reviewedItemModel', // Dynamic ref
    },
    reviewedItemModel: {
      type: String,
      required: true,
      enum: ['Business', 'Post'], // The models that can be reviewed
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

// Ensure a user can only review a specific item once
reviewSchema.index({ reviewedItem: 1, user: 1 }, { unique: true });

export const Review = model<IReview>('Review', reviewSchema);
