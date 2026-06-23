// 도움말·피드백 페이지

import { ChevronLeft, ChevronRight, Headphones, Send } from 'lucide-react';
import Link from 'next/link';

import { HELP_FEEDBACK_ITEMS } from '../model/settings-menu';
import type { HelpFeedbackItem } from '../model/settings-menu.types';

function HelpFeedbackMenuItem({
  description,
  href,
  icon: Icon,
  title,
  toneClassName,
}: HelpFeedbackItem) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-[88px] items-center gap-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-container-lowest)] px-5 py-4 shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--color-surface-container-low)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-full ${toneClassName}`}
          aria-hidden="true"
        >
          <Icon size={22} strokeWidth={1.8} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-[var(--color-outline)]">
            {description}
          </span>
          <strong className="mt-1 block text-base font-semibold text-[var(--color-on-surface)]">
            {title}
          </strong>
        </span>

        <ChevronRight size={20} className="shrink-0 text-[var(--color-on-surface)]" />
      </Link>
    </li>
  );
}

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
            <HelpFeedbackMenuItem key={item.href} {...item} />
          ))}
        </ul>
      </section>

      <p className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-5 py-4 text-center text-sm leading-6 text-[var(--color-primary)]">
        베타 운영과 사용자 개선 루프를 연결합니다.
      </p>

      <div className="mt-auto grid gap-3">
        <Link href="#feedback" className="site-button site-button--primary w-full gap-2">
          <Send size={18} aria-hidden="true" />
          피드백 보내기
        </Link>
        <Link href="#faq" className="site-button site-button--secondary w-full">
          FAQ 보기
        </Link>
      </div>
    </main>
  );
}
