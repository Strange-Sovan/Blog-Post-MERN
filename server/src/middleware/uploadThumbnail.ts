import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';

export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

const imageExtensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    fs.mkdir(UPLOAD_DIR, { recursive: true }, (error) => callback(error, UPLOAD_DIR));
  },
  filename: (_req, file, callback) => {
    callback(null, `${randomUUID()}${imageExtensions[file.mimetype]}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!imageExtensions[file.mimetype]) {
      callback(new ApiError(HttpStatus.BAD_REQUEST, 'Choose a JPEG, PNG, WebP, or GIF image.'));
      return;
    }
    callback(null, true);
  },
});

export const uploadThumbnail = (req: Request, res: Response, next: NextFunction): void => {
  upload.single('thumbnail')(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      next(new ApiError(HttpStatus.PAYLOAD_TOO_LARGE, 'Image must be 5 MB or smaller.'));
      return;
    }
    if (error instanceof multer.MulterError) {
      next(new ApiError(HttpStatus.BAD_REQUEST, 'Unable to process the uploaded image.'));
      return;
    }
    next(error);
  });
};
