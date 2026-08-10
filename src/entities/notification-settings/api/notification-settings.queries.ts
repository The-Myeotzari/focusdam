import { Api } from '@/shared/lib/api/api';

import { NotificationSettingsResponseSchema } from './notification-settings.schema';
import type { NotificationSettings } from '../model/notification-settings.types';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  startReminder: true,
  spendHold: true,
  emotionReset: false,
  quietHours: true,
};

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const response = await Api.get('/notification-settings', NotificationSettingsResponseSchema, {
    credentials: 'include',
  });

  return response.settings;
}

export async function updateNotificationSettingsClient(
  settings: NotificationSettings,
): Promise<NotificationSettings> {
  const response = await Api.patch(
    '/notification-settings',
    NotificationSettingsResponseSchema,
    {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    },
  );

  return response.settings;
}
