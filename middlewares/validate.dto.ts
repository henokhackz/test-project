import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import ApiError from '../utils/api-error.js';

export const validateDTO = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join(', ');
      return next(new ApiError(400, `Validation failed: ${errors}`));
    }

    req.body = result.data;
    next();
  };
};
