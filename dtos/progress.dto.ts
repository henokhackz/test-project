import { z } from 'zod';

export const createProgressSchema = z.object({
  id: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, 'id is required')
  ),
  lesson: z.string().min(1, 'lesson is required'),
  score: z.preprocess((val) => Number(val), z.number().int()),
});

export type CreateProgressDTO = z.infer<typeof createProgressSchema>;
