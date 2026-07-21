import { ShieldCheck } from 'lucide-react';
import { SiteTopBar } from '@/shared/ui';

import { getConsentSettings } from '@/entities/consent-settings';
import { ConsentSettingsForm } from '@/features/update-consent-settings';

export async function ConsentManagementPage() {
  const consentSettings = await getConsentSettings();

  return (
    <main className="flex gap-8 flex-col px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <SiteTopBar title="선택동의 관리" backHref="/settings/account" />

      <section className="rounded-[var(--radius-xxl)] bg-[var(--ds-caution)] px-8 py-7">
        <p className="flex items-center gap-2 text-xs font-semibold">
          <ShieldCheck size={18} aria-hidden="true" />
          Privacy First
        </p>
        <h2 className="mt-4 text-[28px] font-medium leading-9">민감정보는 선택 사항이에요</h2>
        <p className="mt-5 text-sm leading-6">
          필수 기능은 최소한의 정보로 사용하고, 선택 정보는 언제든 원할 때 끌 수 있습니다.
        </p>
      </section>

      <ConsentSettingsForm initialSettings={consentSettings} />
    </main>
  );
}
