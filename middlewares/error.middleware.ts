import type { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/api-error.js';
import logger from '../utils/logger.js';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV === 'development' && err instanceof Error
        ? err.stack
        : undefined,
  });
};
