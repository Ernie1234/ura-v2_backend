import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  creator: Types.ObjectId; // Ref to Business
  eventName: string;
  description: string;
  image?: string;
  date: Date;
  time: {
    start: string;
    end: string;
  };
  location: string;
  category: string;
  attendees: Types.ObjectId[]; // Refs to Users
}

const eventSchema = new Schema<IEvent>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    date: { type: Date, required: true },
    time: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    location: { type: String, required: true },
    category: { type: String },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Event = model<IEvent>('Event', eventSchema);
