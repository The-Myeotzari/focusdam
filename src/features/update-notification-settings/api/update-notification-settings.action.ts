'use server';

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

  const endpoint = process.env.NOTIFICATION_SETTINGS_API_URL;

  if (!endpoint) {
    return {
      success: true,
      message: 'API 연결 전 임시 저장 요청을 확인했습니다.',
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        message: '알림 설정을 저장하지 못했습니다.',
      };
    }

    return {
      success: true,
      message: '알림 설정을 저장했습니다.',
    };
  } catch {
    return {
      success: false,
      message: '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
    };
  }
}
