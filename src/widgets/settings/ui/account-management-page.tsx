// 계정 정보 관리 페이지 컴포넌트

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { getCurrentUser, UserAccountCard } from '@/entities/user';
import { ACCOUNT_SETTINGS_MENU_SECTIONS, SettingsMenu } from '@/widgets/settings';

export async function AccountManagementPage() {
  const user = await getCurrentUser();

  return (
    <main className="flex gap-8 flex-col px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <header className="flex items-center gap-3">
        <Link
          href="/settings"
          aria-label="설정으로 돌아가기"
          className="grid size-11 place-items-center rounded-full"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>

        <h1 className="text-center text-[24px] leading-8">계정 관리(헤더 작업 필요)</h1>
      </header>

      {/* 유저 정보 카드 */}
      <UserAccountCard user={user} />

      {/* 계정 설정 메뉴 */}
      <SettingsMenu sections={ACCOUNT_SETTINGS_MENU_SECTIONS} />
    </main>
  );
}
