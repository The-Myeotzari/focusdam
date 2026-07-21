// 알림 관리 페이지


import { getNotificationSettings } from '@/entities/notification-settings';
import { NotificationSettingsForm } from '@/features/update-notification-settings';
import { SiteTopBar } from '@/shared/ui';

export async function NotificationManagementPage() {
  const settings = await getNotificationSettings();

  return (
    <main className="flex gap-8 flex-col px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <SiteTopBar title="알림 관리" backHref="/settings" />

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-8 py-9">
        <h2 className="text-[26px] font-medium leading-9 text-[var(--color-on-surface)]">
          언제 도와드릴까요?
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          개입 타이밍은 사용자가 언제든 조정할 수 있습니다.
        </p>
      </section>

      <NotificationSettingsForm initialSettings={settings} />
    </main>
  );
}
