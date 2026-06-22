// 선택 동의 설정 폼 컴포넌트

'use client';

import type { ConsentSettings } from '@/entities/consent-settings';

import { useConsentSettings } from '../lib/useConsentSettings';
import { ConsentSettingItem } from './consent-setting-item';
import { CONSENT_SETTING_ITEMS } from './consent-setting-items';

type Props = {
  initialSettings: ConsentSettings;
};

export function ConsentSettingsForm({ initialSettings }: Props) {
  const { disableAllSettings, isPending, saveSettings, settings, statusMessage, updateSetting } =
    useConsentSettings(initialSettings);

  return (
    <div className="grid flex-1 gap-8">
      <ul className="grid gap-4" aria-label="선택 동의 항목">
        {CONSENT_SETTING_ITEMS.map((item) => {
          return (
            <ConsentSettingItem
              key={item.id}
              {...item}
              checked={settings[item.id]}
              onCheckedChange={updateSetting}
            />
          );
        })}
      </ul>

      <div className="mt-auto grid gap-3">
        <p className="text-center text-xs leading-5 text-[var(--color-on-surface-variant)]">
          여러분의 데이터는 안전하게 암호화되어 보호됩니다.
        </p>

        <button
          type="button"
          disabled={isPending}
          onClick={saveSettings}
          className="site-button site-button--primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? '저장 중...' : '동의 설정 저장'}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={disableAllSettings}
          className="min-h-12 text-sm text-[var(--color-on-surface-variant)] disabled:opacity-60"
        >
          모두 끄기
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
