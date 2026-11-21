import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/IRequest';
import { Role } from '../constants/roles';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';

export const authorize =
  (...roles: Role[]) =>
  (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      throw new ApiError(HttpStatus.FORBIDDEN, Messages.ADMIN_FORBIDDEN);
    }
    next();
  };
