import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error('Non-operational error:', err);
    }
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    res.status(HttpStatus.CONFLICT).json({
      success: false,
      statusCode: HttpStatus.CONFLICT,
      message: `A record with this ${field} already exists`,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: Messages.VALIDATION_ERROR,
      errors,
    });
    return;
  }

  logger.error('Unhandled error:', err);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: Messages.INTERNAL_ERROR,
  });
};

