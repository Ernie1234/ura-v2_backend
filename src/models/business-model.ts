import { Schema, model, Document, Types } from 'mongoose';

// Interface for GeoJSON
interface IPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Structure for operating hours
interface IOperatingHour {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  open: string; // e.g., "09:00"
  close: string; // e.g., "17:00"
  isClosed?: boolean; // To mark as closed for the day
}

export interface IBusiness extends Document {
  owner: Types.ObjectId; // Ref to User
  businessName: string;
  about: string;
  tagline?: string;
  category: 'Restaurant' | 'Fashion' | 'Auto Repair' | 'Stores' | 'Beauty' | 'Other';
  profileImage?: string;
  coverImage?: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    x?: string;
    facebook?: string;
    whatsapp?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string; // For display
  };
  location?: IPoint; // For geospatial queries
  operatingHours: IOperatingHour[];
  followers: Types.ObjectId[]; // Refs to Users
  likes: Types.ObjectId[];
  loanEligibility: number;
  // Vector field for semantic search on business descriptions
  descriptionVector?: number[];
}

const businessSchema = new Schema<IBusiness>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true, trim: true },
    about: { type: String },
    tagline: { type: String },
    category: {
      type: String,
      enum: ['Restaurant', 'Fashion', 'Auto Repair', 'Stores', 'Beauty', 'Other'],
      required: true,
    },
    profileImage: { type: String },
    coverImage: { type: String },
    contact: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      fullAddress: { type: String },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    operatingHours: [
      {
        day: { type: String },
        open: { type: String },
        close: { type: String },
      },
    ],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    loanEligibility: { type: Number, default: 0 },
    descriptionVector: { type: [Number], select: false }, // Store embedding
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
businessSchema.index({ location: '2dsphere' });

// Create an index for vector search (assuming MongoDB Atlas)
// You would create this in Atlas UI or via a command
/*
businessSchema.index(
  { descriptionVector: "vector" },
  { "vectorSearchOptions": { "dimensions": 1536, "similarity": "cosine" } }
);
*/

export const Business = model<IBusiness>('Business', businessSchema);
