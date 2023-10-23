import { z } from 'zod';
// TODO: more advanced validation
export const QuestionCreatePayload = z.object({
  title: z.string().min(3),
  variant: z.enum(['single', 'multi', 'code']),
  code: z.optional(z.object({ lang: z.string(), content: z.string(), sample: z.optional(z.boolean()) })),
  options: z.optional(z.array(z.object({ id: z.number().int(), value: z.string(), isSelected: z.boolean() })))
});

export const QuestionUpdatePayload = QuestionCreatePayload.partial();
