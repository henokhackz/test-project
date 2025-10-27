import { asyncHandler } from '../utils/async-handler.js';
import { createUserService } from '../service/user.service.js';
import { successResponse } from '../utils/api-response.js';

export const createUserController = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  return successResponse(res, 'User created successfully', user, 201);
});
