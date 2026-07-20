import { z } from 'zod';

export const ApiErrorSchema = z.object({
  type: z.literal('about:blank'),
  title: z.string(),
  status: z.number().int().min(400).max(599),
  detail: z.string(),
  timestamp: z.iso.datetime(),
  path: z.string(),
});

export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;
