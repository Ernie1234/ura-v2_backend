// message.model.ts
import { Schema, model, Document, Types } from 'mongoose';

// Interface for media files stored on AWS S3
interface IMedia {
  url: string;
  type: 'image' | 'video' | 'audio' | 'file';
  fileName?: string;
}

// Interface for message reactions
interface IReaction {
  user: Types.ObjectId; // Ref to User
  emoji: string; // The emoji character
}

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  senderModel: 'User' | 'Business';
  content?: string; // Text content (emojis are just text) - now optional
  media?: IMedia; // For pictures, videos, voice notes
  reactions: IReaction[]; // For message reactions
  readBy: Types.ObjectId[];
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
    senderModel: { type: String, required: true, enum: ['User', 'Business'] },
    content: { type: String }, // Optional if media is present
    media: {
      url: { type: String },
      type: { type: String, enum: ['image', 'video', 'audio', 'file'] },
      fileName: { type: String },
    },
    reactions: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String },
      },
    ],
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', messageSchema);
