import { z } from 'zod';

export const QuizCreatePayload = z.object({
  title: z.string().min(3),
  introMessage: z.string(),
  outroMessage: z.string(),
  timeLimitMs: z.number().int(),
  attemptsCount: z.number().int(),
  randomize: z.boolean()
});

export const QuizUpdatePayload = QuizCreatePayload.partial();
