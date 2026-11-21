import mongoose, { Schema } from 'mongoose';
import { IPost } from '../interfaces/IPost';

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    thumbnailUrl: { type: String, trim: true, default: '' },
    slug: { type: String, required: true, unique: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PostSchema.index({ title: 'text', content: 'text' });

export const PostModel = mongoose.model<IPost>('Post', PostSchema);
