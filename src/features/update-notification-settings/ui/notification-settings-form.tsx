'use client';

import { useState, useTransition } from 'react';

import type { NotificationSettingId, NotificationSettings } from '@/entities/notification-settings';

import { updateNotificationSettings } from '../api/update-notification-settings.action';
import { NotificationSettingItem } from './notification-setting-item';
import { NOTIFICATION_SETTING_ITEMS } from './notification-setting-items';

type Props = {
  initialSettings: NotificationSettings;
};

export function NotificationSettingsForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
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
    setSettings(initialSettings);
  }

  function saveSettings() {
    startTransition(async () => {
      const result = await updateNotificationSettings(settings);

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
