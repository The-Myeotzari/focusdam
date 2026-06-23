// 도움말·피드백 페이지

import { ChevronLeft, Headphones } from 'lucide-react';
import Link from 'next/link';

import { HELP_FEEDBACK_ITEMS } from '../model/settings-menu';
import { SettingsMenuItem } from './settings-menu-item';

export function HelpFeedbackPage() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <header className="flex items-center gap-3">
        <Link
          href="/settings"
          aria-label="설정으로 돌아가기"
          className="grid size-11 place-items-center rounded-full"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>

        <h1 className="flex-1 text-center text-[24px] leading-8">도움말·피드백</h1>
        <span className="min-w-11" aria-hidden="true" />
      </header>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-8 py-9 shadow-[var(--shadow-card)]">
        <h2 className="text-[28px] font-medium leading-10 text-[var(--color-on-surface)]">
          막혔을 때
          <br />
          도움을 요청하세요
        </h2>
        <p className="mt-5 text-base leading-7 text-[var(--color-on-surface-variant)]">
          FAQ, 문의, 피드백을 통해
          <br />
          제품 개선에 참여할 수 있습니다.
        </p>

        <div className="mt-8 flex justify-end">
          <span
            className="grid size-14 place-items-center rounded-full bg-[#d8e2ec] text-[var(--color-primary)]"
            aria-hidden="true"
          >
            <Headphones size={26} strokeWidth={1.8} />
          </span>
        </div>
      </section>

      <section aria-label="도움말 및 피드백 항목">
        <ul className="grid gap-4">
          {HELP_FEEDBACK_ITEMS.map((item) => (
            <SettingsMenuItem key={item.href} {...item} />
          ))}
        </ul>
      </section>
    </main>
  );
}
