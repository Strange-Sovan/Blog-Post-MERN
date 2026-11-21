import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/IRequest';
import logger from '../utils/logger';

export const activityLogger =
  (action: string) =>
  (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    const userId = req.user?._id || 'anonymous';
    const email = req.user?.email || 'anonymous';
    logger.info(`ACTIVITY [${action}] | User: ${userId} (${email}) | IP: ${req.ip} | ${req.method} ${req.originalUrl}`);
    next();
  };
