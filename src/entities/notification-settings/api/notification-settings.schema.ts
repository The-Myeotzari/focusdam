import { z } from 'zod';

export const NotificationSettingsSchema = z.object({
  startReminder: z.boolean(),
  spendHold: z.boolean(),
  emotionReset: z.boolean(),
  quietHours: z.boolean(),
});

export const NotificationSettingsResponseSchema = z.object({
  ok: z.literal(true),
  settings: NotificationSettingsSchema,
});

export type NotificationSettingsResponse = z.infer<typeof NotificationSettingsResponseSchema>;
