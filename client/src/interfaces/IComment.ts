import { IUser } from './IUser';

export interface IComment {
  _id: string;
  content: string;
  author: Pick<IUser, '_id' | 'name' | 'email'>;
  post: string;
  createdAt: string;
  updatedAt: string;
}

