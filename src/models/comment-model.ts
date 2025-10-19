import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  post: Types.ObjectId; // Ref to Post
  author: Types.ObjectId; // Ref to User
  content: string;
  likes: Types.ObjectId[]; // Refs to Users
  parentComment?: Types.ObjectId; // For threading replies
}

const commentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' }, // Self-referencing
  },
  { timestamps: true }
);

export const Comment = model<IComment>('Comment', commentSchema);
