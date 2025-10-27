import type { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to automatically catch and forward errors to Express middleware.
 */
export const asyncHandler = <
  T extends (req: Request, res: Response, next: NextFunction) => Promise<any>,
>(
  fn: T
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
