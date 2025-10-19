import { Schema, model, Document, Types } from 'mongoose';

export interface IDeal extends Document {
  business: Types.ObjectId; // Ref to Business
  title: string;
  description: string;
  type: 'Deal' | 'Offer' | 'Promo';
  image?: string;
  startDate: Date;
  expiryDate?: Date; // For "Ends in 3 Days"
}

const dealSchema = new Schema<IDeal>(
  {
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Deal', 'Offer', 'Promo'], required: true },
    image: { type: String },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

export const Deal = model<IDeal>('Deal', dealSchema);
