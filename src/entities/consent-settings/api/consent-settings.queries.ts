// 선택 동의 관리 get

import type { ConsentSettings } from '../model/consent-settings.types';

const DEFAULT_CONSENT_SETTINGS: ConsentSettings = {
  analysisUsage: true,
  emotionRecord: true,
  spendingRecord: false,
};

function isConsentSettings(value: unknown): value is ConsentSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return (
    typeof settings.analysisUsage === 'boolean' &&
    typeof settings.emotionRecord === 'boolean' &&
    typeof settings.spendingRecord === 'boolean'
  );
}

export async function getConsentSettings(): Promise<ConsentSettings> {
  const endpoint = process.env.CONSENT_SETTINGS_API_URL;

  if (!endpoint) {
    return DEFAULT_CONSENT_SETTINGS;
  }

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return DEFAULT_CONSENT_SETTINGS;
    }

    const data: unknown = await response.json();
    return isConsentSettings(data) ? data : DEFAULT_CONSENT_SETTINGS;
  } catch {
    return DEFAULT_CONSENT_SETTINGS;
  }
}
