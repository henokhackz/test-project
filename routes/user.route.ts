import { Router } from 'express';
import { createUserController } from '../controllers/user.controller.js';
import { validateDTO } from '../middlewares/validate.dto.js';
import { createUserSchema } from '../dtos/user.dto.js';

const router = Router();

router.post('/', validateDTO(createUserSchema), createUserController);

export default router;
