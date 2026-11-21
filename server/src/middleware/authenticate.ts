import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import logger from '../utils/logger';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, Messages.AUTH_UNAUTHORIZED);
    }
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      logger.warn('Invalid token attempt:', error);
      next(new ApiError(HttpStatus.UNAUTHORIZED, Messages.AUTH_TOKEN_INVALID));
    }
  }
};
