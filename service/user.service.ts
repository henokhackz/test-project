import prisma from '../config/prisma.js';
import { withErrorHandling } from '../utils/with-error-handler.js';
import type { CreateUserDTO } from '../dtos/user.dto.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import logger from '../utils/logger.js';
import ApiError from '../utils/api-error.js';

const CACHE_FILE = './users-cache.json';

function saveUserToCache(user: CreateUserDTO) {
  let cache = [];
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }
  cache.push(user);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/* Sync cached users to DB 
when possible  
*/
export const syncCachedUsers = async () => {
  if (!fs.existsSync(CACHE_FILE)) return;

  const cachedUsers = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  for (const u of cachedUsers) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: u.email },
      });
      if (!existing) {
        await prisma.user.create({ data: u });
      }
    } catch (err) {
      logger.error(
        `Failed to sync cached user: ${err instanceof Error ? err.message : String(err)}`
      );
      return;
    }
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify([]));
};

export const createUserService = async (data: CreateUserDTO) =>
  withErrorHandling(async () => {
    const { email, name, password } = data;

    const hashedPassword = hashPasswordSync(password);

    const userData = { name, email, password: hashedPassword };

    try {

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ApiError(400, 'User with this email already exists');
      }

      const { password: userPassword, ...rest } = await prisma.user.create({
        data: userData,
      });
      return { user: rest };
    } catch (err) {
      logger.warn(
        `Database unavailable, caching user data. Error: ${err instanceof Error ? err.message : String(err)}`
      );
      saveUserToCache(userData);
      const { password: userPassword, ...rest } = userData;
      return { user: rest, offline: true };
    }
  }, 'Failed to create user');

function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(
  plainPassword: string,
  hashedPassword: string
): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
