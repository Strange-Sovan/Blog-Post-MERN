export type UserRole = 'user' | 'admin';
export type AuthProvider = 'local' | 'google' | 'facebook';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

