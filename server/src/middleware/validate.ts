import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.filter((p) => p !== 'body').join('.'),
          message: e.message,
        }));
        next(new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, Messages.VALIDATION_ERROR, errors));
      } else {
        next(error);
      }
    }
  };

