import jwt, { SignOptions } from 'jsonwebtoken';
import { IUserPayload } from '../interfaces/IUser';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const signAccessToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES } as SignOptions);
};

export const signRefreshToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES } as SignOptions);
};

export const verifyAccessToken = (token: string): IUserPayload => {
  return jwt.verify(token, ACCESS_SECRET) as IUserPayload;
};

export const verifyRefreshToken = (token: string): IUserPayload => {
  return jwt.verify(token, REFRESH_SECRET) as IUserPayload;
};

