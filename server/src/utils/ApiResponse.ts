import { Response } from 'express';
import { HttpStatusCode } from '../constants/httpStatus';
import { IApiResponse, IPaginationMeta } from '../interfaces/IApiResponse';

export class ApiResponse {
  static send<T>(
    res: Response,
    statusCode: HttpStatusCode,
    message: string,
    data?: T,
    meta?: IPaginationMeta
  ): Response {
    const response: IApiResponse<T> = {
      success: statusCode < 400,
      statusCode,
      message,
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    statusCode: HttpStatusCode,
    message: string,
    errors?: Array<{ field?: string; message: string }>
  ): Response {
    const response: IApiResponse = {
      success: false,
      statusCode,
      message,
      ...(errors && { errors }),
    };
    return res.status(statusCode).json(response);
  }
}

