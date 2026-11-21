import { IUser } from './IUser';

export interface IPost {
  _id: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  slug: string;
  author: Pick<IUser, '_id' | 'name' | 'email'>;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}
