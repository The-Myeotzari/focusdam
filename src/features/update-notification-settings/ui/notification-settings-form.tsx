'use client';

import { useState, useTransition } from 'react';

import { updateNotificationSettings } from '../api/update-notification-settings.action';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTING_ITEMS,
} from '../model/notification-settings';
import type { NotificationSettingId } from '../model/notification-settings.types';
import { NotificationSettingItem } from './notification-setting-item';

export function NotificationSettingsForm() {
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateSetting(id: NotificationSettingId, checked: boolean) {
    setStatusMessage(null);
    setSettings((currentSettings) => ({
      ...currentSettings,
      [id]: checked,
    }));
  }

  function resetSettings() {
    setStatusMessage(null);
    setSettings(DEFAULT_NOTIFICATION_SETTINGS);
  }

  function saveSettings() {
    startTransition(async () => {
      const result = await updateNotificationSettings({
        startReminder: settings['start-reminder'],
        spendHold: settings['spend-hold'],
        emotionReset: settings['emotion-reset'],
        quietHours: settings['quiet-hours'],
      });

      setStatusMessage(result.message);
    });
  }

  return (
    <div className="grid flex-1 gap-8">
      <section aria-label="알림 항목">
        <ul className="grid gap-4">
          {NOTIFICATION_SETTING_ITEMS.map((item) => (
            <NotificationSettingItem
              key={item.id}
              checked={settings[item.id]}
              item={item}
              onCheckedChange={updateSetting}
            />
          ))}
        </ul>
      </section>

      <div className="mt-auto grid gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={saveSettings}
          className="site-button site-button--primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={resetSettings}
          className="site-button site-button--secondary w-full"
        >
          기본값으로
        </button>

        <p
          aria-live="polite"
          className="min-h-5 text-center text-xs text-[var(--color-on-surface-variant)]"
        >
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
