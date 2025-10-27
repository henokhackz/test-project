import { Router } from 'express';
import { validateDTO } from '../middlewares/validate.dto.js';
import { createProgressSchema } from '../dtos/progress.dto.js';
import {
  createProgressController,
  getProgressController,
} from '../controllers/progress.controller.js';

const router = Router();

router.post('/', validateDTO(createProgressSchema), createProgressController);
router.get('/', getProgressController);
export default router;
