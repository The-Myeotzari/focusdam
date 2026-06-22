export type UpdateNotificationSettingsInput = {
  startReminder: boolean;
  spendHold: boolean;
  emotionReset: boolean;
  quietHours: boolean;
};

export type UpdateNotificationSettingsResult = {
  success: boolean;
  message: string;
};
