import { asyncHandler } from '../utils/async-handler.js';
import { successResponse } from '../utils/api-response.js';
import {
  createProgressService,
  getProgress,
} from '../service/progress.service.js';

export const createProgressController = asyncHandler(async (req, res) => {
  const progress = await createProgressService(req.body);
  return successResponse(res, 'progress created successfully', progress, 201);
});

export const getProgressController = asyncHandler(async (req, res) => {
  const progresses = await getProgress();
  return successResponse(res, 'Progress fetched successfully', progresses, 200);
});
