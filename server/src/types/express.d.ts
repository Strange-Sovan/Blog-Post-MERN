import { IUserPayload } from '../interfaces/IUser';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUserPayload {}
    interface Request {
      user?: IUserPayload;
    }
  }
}

export {};
