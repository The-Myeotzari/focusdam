import {
  NOTIFICATION_SETTINGS_UPDATED_EVENT,
  updateNotificationSettingsClient,
} from '@/entities/notification-settings';
import { ApiRequestError } from '@/shared/lib/api/api';
import type {
  UpdateNotificationSettingsInput,
  UpdateNotificationSettingsResult,
} from '../model/update-notification-settings.types';

export async function updateNotificationSettings(
  input: UpdateNotificationSettingsInput
): Promise<UpdateNotificationSettingsResult> {
  const hasInvalidValue = Object.values(input).some((value) => typeof value !== 'boolean');

  if (hasInvalidValue) {
    return {
      success: false,
      message: '알림 설정 값을 다시 확인해주세요.',
    };
  }

  try {
    const savedSettings = await updateNotificationSettingsClient(input);

    window.dispatchEvent(
      new CustomEvent(NOTIFICATION_SETTINGS_UPDATED_EVENT, {
        detail: savedSettings,
      }),
    );

    return {
      success: true,
      message: '알림 설정을 저장했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiRequestError
          ? error.body.detail
          : '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
    };
  }
}
