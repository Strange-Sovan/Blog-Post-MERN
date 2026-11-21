import mongoose, { Schema } from 'mongoose';
import { IComment } from '../interfaces/IComment';

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

