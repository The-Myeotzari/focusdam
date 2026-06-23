import type { NotificationSettings } from '@/entities/notification-settings';

export type UpdateNotificationSettingsInput = NotificationSettings;

export type UpdateNotificationSettingsResult = {
  success: boolean;
  message: string;
};
