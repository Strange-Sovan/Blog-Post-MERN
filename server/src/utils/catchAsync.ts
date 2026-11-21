import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (
  req: any,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

export const catchAsync = (fn: AsyncHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
