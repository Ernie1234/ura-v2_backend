import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  // A chat is between one User and one Business
  participants: {
    user: Types.ObjectId;
    business: Types.ObjectId;
  };
  lastMessage?: Types.ObjectId; // Ref to the latest message for previews
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true }
);

// Ensure a user/business pair is unique
conversationSchema.index({ 'participants.user': 1, 'participants.business': 1 }, { unique: true });

export const Conversation = model<IConversation>('Conversation', conversationSchema);
