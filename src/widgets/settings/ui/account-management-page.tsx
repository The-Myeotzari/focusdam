// 계정 정보 관리 페이지 컴포넌트

import { SiteTopBar } from '@/shared/ui';

import { CurrentUserAccountCard } from '@/entities/user';
import { ACCOUNT_SETTINGS_MENU_SECTIONS, SettingsMenu } from '@/widgets/settings';

export function AccountManagementPage() {
  return (
    <main className="flex gap-8 flex-col px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <SiteTopBar title="계정 관리" backHref="/settings" />

      {/* 유저 정보 카드 */}
      <CurrentUserAccountCard />

      {/* 계정 설정 메뉴 */}
      <SettingsMenu sections={ACCOUNT_SETTINGS_MENU_SECTIONS} />
    </main>
  );
}
