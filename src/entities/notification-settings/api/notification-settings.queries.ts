// Notification Settings API Queries
import type { NotificationSettings } from '../model/notification-settings.types';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  startReminder: true,
  spendHold: true,
  emotionReset: false,
  quietHours: true,
};

function isNotificationSettings(value: unknown): value is NotificationSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.startReminder === 'boolean' &&
    typeof settings.spendHold === 'boolean' &&
    typeof settings.emotionReset === 'boolean' &&
    typeof settings.quietHours === 'boolean'
  );
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const endpoint = process.env.NOTIFICATION_SETTINGS_API_URL;

  if (!endpoint) {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }

    const data: unknown = await response.json();
    return isNotificationSettings(data) ? data : DEFAULT_NOTIFICATION_SETTINGS;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}
