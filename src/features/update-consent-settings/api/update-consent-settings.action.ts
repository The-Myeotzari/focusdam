'use server';

import type { ConsentSettings } from '@/entities/consent-settings';

import type { UpdateConsentSettingsResult } from '../model/update-consent-settings.types';

// 선택 동의 설정 업데이트 액션
export async function updateConsentSettings(
  input: ConsentSettings,
): Promise<UpdateConsentSettingsResult> {
  const hasInvalidValue = Object.values(input).some((value) => typeof value !== 'boolean');

  if (hasInvalidValue) {
    return {
      success: false,
      mode: 'mock',
      message: '선택 동의 값을 다시 확인해주세요.',
    };
  }

  const endpoint = process.env.CONSENT_SETTINGS_API_URL;

  if (!endpoint) {
    return {
      success: true,
      mode: 'mock',
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
        mode: 'api',
        message: '선택 동의 설정을 저장하지 못했습니다.',
      };
    }

    return {
      success: true,
      mode: 'api',
      message: '선택 동의 설정을 저장했습니다.',
    };
  } catch {
    return {
      success: false,
      mode: 'api',
      message: '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
    };
  }
}
