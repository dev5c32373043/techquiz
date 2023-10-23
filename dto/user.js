import { z } from 'zod';

export const UpdateProfilePayload = z
  .object({
    quiz: z.object({
      timeLimitMs: z.number().int(),
      attemptsCount: z.number().int(),
      randomize: z.boolean()
    }),
    notifications: z.object({ slack: z.object({ channelId: z.string() }) })
  })
  .partial();
