import ApiError from './api-error.js';
import logger from './logger.js';

/**
 * Wraps async service functions to handle and log errors globally.
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  message = 'Internal server error'
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    logger.error(error);
    throw new ApiError(500, message);
  }
};
