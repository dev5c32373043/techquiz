import { z } from 'zod';
// TODO: more advanced validation
export const MemberResponsePayload = z
  .object({
    code: z.object({ lang: z.string(), content: z.string(), timeSpentMs: z.number().int() }),
    options: z.array(z.object({ id: z.number().int(), value: z.string(), isSelected: z.optional(z.boolean()) }))
  })
  .partial();
