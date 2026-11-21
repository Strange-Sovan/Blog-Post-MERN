import rateLimit from 'express-rate-limit';
import { HttpStatus } from '../constants/httpStatus';

const createLimiter = (windowMinutes: number, maxRequests: number, message: string) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message,
    },
  });

export const authLimiter = createLimiter(15, 10, 'Too many authentication attempts, please try again after 15 minutes');
export const apiLimiter = createLimiter(15, 200, 'Too many requests, please slow down');
export const adminLimiter = createLimiter(15, 50, 'Too many admin requests, please slow down');

