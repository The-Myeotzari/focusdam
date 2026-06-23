// 선택 동의 설정 관리 훅

'use client';

import { useState, useTransition } from 'react';

import type { ConsentSettingId, ConsentSettings } from '@/entities/consent-settings';

import { updateConsentSettings } from '../api/update-consent-settings.action';

const DISABLED_CONSENT_SETTINGS: ConsentSettings = {
  analysisUsage: false,
  emotionRecord: false,
  spendingRecord: false,
};

export function useConsentSettings(initialSettings: ConsentSettings) {
  const [settings, setSettings] = useState(initialSettings);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateSetting(id: ConsentSettingId, checked: boolean) {
    setStatusMessage(null);
    setSettings((currentSettings) => ({
      ...currentSettings,
      [id]: checked,
    }));
  }

  function disableAllSettings() {
    setStatusMessage(null);
    setSettings(DISABLED_CONSENT_SETTINGS);
  }

  function saveSettings() {
    startTransition(async () => {
      const result = await updateConsentSettings(settings);
      setStatusMessage(result.message);
    });
  }

  return {
    disableAllSettings,
    isPending,
    saveSettings,
    settings,
    statusMessage,
    updateSetting,
  };
}
