import prisma from '../config/prisma.js';
import { withErrorHandling } from '../utils/with-error-handler.js';
import ApiError from '../utils/api-error.js';
import fs from 'fs';

import type { CreateProgressDTO } from '../dtos/progress.dto.js';
import type { Progress } from '../generated/prisma/client.js';

const CACHE_FILE = './progress-cache.json';
function saveProgressToCache(progress: Progress) {
  let cache = [];
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }
  cache.push(progress);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

export const createProgressService = async (data: CreateProgressDTO) =>
  withErrorHandling(async () => {
    const { id: userId, lesson, score } = data;
    if (!userId || !lesson || typeof score !== 'number') {
      throw new ApiError(400, 'Invalid data provided');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, `User with id ${userId} not found`);

    const progress = await prisma.progress.create({
      data: { user_id: userId, lesson, score },
    });

    saveProgressToCache(progress);

    return { status: 'success', data: { progress } };
  }, 'Failed to create progress');

export const getProgress = async () =>
  withErrorHandling(async () => {
    const progresses = await prisma.progress.findMany();
    return { progresses };
  }, 'Failed to fetch progresses');
