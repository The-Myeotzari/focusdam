export type NotificationSettings = {
  startReminder: boolean;
  spendHold: boolean;
  emotionReset: boolean;
  quietHours: boolean;
};

export type NotificationSettingId = keyof NotificationSettings;
