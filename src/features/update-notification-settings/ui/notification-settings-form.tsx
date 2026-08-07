'use client';

import { useEffect, useState, useTransition } from 'react';

import {
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationSettings,
  type NotificationSettingId,
  type NotificationSettings,
} from '@/entities/notification-settings';

import { updateNotificationSettings } from '../api/update-notification-settings.action';
import { NotificationSettingItem } from './notification-setting-item';
import { NOTIFICATION_SETTING_ITEMS } from './notification-setting-items';

export function NotificationSettingsForm() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [savedSettings, setSavedSettings] =
    useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    void getNotificationSettings()
      .then((loadedSettings) => {
        if (!active) return;

        setSettings(loadedSettings);
        setSavedSettings(loadedSettings);
      })
      .catch(() => {
        if (active) {
          setStatusMessage('알림 설정을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function updateSetting(id: NotificationSettingId, checked: boolean) {
    setStatusMessage(null);
    setSettings((currentSettings) => ({
      ...currentSettings,
      [id]: checked,
    }));
  }

  function resetSettings() {
    setStatusMessage(null);
    setSettings(savedSettings);
  }

  function saveSettings() {
    startTransition(async () => {
      const result = await updateNotificationSettings(settings);

      if (result.success) {
        setSavedSettings(settings);
      }
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
              disabled={isLoading || isPending}
              item={item}
              onCheckedChange={updateSetting}
            />
          ))}
        </ul>
      </section>

      <div className="mt-auto grid gap-3">
        <button
          type="button"
          disabled={isLoading || isPending}
          onClick={saveSettings}
          className="site-button site-button--primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? '불러오는 중...' : isPending ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          disabled={isLoading || isPending}
          onClick={resetSettings}
          className="site-button site-button--secondary w-full disabled:cursor-not-allowed disabled:opacity-60"
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
