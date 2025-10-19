// post.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  business: Types.ObjectId; // Ref to Business
  name: string; // Product name
  description: string; // Product/post description
  itemNumber?: string; // The item/product number you want to track
  price: number;
  media?: string[];
  tags?: string[];
  likes: Types.ObjectId[]; // Refs to Users/Business who liked this post
  // Vector field for semantic search on post/product description
  descriptionVector?: number[];
}

const postSchema = new Schema<IPost>(
  {
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    itemNumber: { type: String, sparse: true, unique: true }, // Optional, but unique if provided
    price: { type: Number, required: true, min: 0 },
    media: [{ type: String }], // S3 URLs
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    descriptionVector: { type: [Number], select: false },
  },
  { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema);
