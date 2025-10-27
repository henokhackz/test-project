import type { Response } from 'express';

export const successResponse = (
  res: Response,
  message: string,
  data = {},
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};
