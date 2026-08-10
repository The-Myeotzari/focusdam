export {
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationSettings,
  updateNotificationSettingsClient,
} from './api/notification-settings.queries';
export {
  NotificationSettingsResponseSchema,
  NotificationSettingsSchema,
} from './api/notification-settings.schema';
export type {
  NotificationSettingId,
  NotificationSettings,
} from './model/notification-settings.types';
export { NOTIFICATION_SETTINGS_UPDATED_EVENT } from './model/notification-settings.events';
