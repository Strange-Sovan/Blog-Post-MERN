import { Document, Types } from 'mongoose';

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  thumbnailUrl?: string;
  slug: string;
  author: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
