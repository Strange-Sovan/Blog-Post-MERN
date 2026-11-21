import { Document, Types } from 'mongoose';
import { Role } from '../constants/roles';

export type AuthProvider = 'local' | 'google' | 'facebook';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: Role;
  provider: AuthProvider;
  providerId?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

