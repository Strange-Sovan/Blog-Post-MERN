import { Request } from 'express';
import { IUserPayload } from './IUser';

export interface IAuthRequest extends Request {
  user?: IUserPayload;
}

