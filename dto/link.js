import { z } from 'zod';

export const LinkCreatePayload = z.object({
  name: z.string().min(3),
  userDeviceId: z.optional(z.string()),
  metadata: z.optional(z.array(z.object({ id: z.number().int(), key: z.string(), value: z.string() })))
});

export const LinkUpdatePayload = LinkCreatePayload.partial();
