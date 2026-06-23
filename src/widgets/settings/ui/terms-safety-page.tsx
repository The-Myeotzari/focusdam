// 약관·안전 안내 페이지

import { ChevronLeft, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { TERMS_SAFETY_ITEMS } from '../model/settings-menu';
import { SettingsMenuItem } from './settings-menu-item';

export function TermsSafetyPage() {
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

        <h1 className="flex-1 text-center text-[24px] leading-8">약관·안전 안내</h1>
      </header>

      <section className="overflow-hidden rounded-[var(--radius-xxl)] bg-[var(--ds-safety)] px-7 py-8">
        <div>
          <h2 className="text-[30px] font-medium leading-10 text-[var(--ds-safety-ink)]">
            안전하게
            <br />
            사용하기
          </h2>
          <p className="mt-5 max-w-[260px] text-base leading-7 text-[var(--ds-safety-ink)]">
            집중이담의 역할과 한계를 명확히 안내합니다.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <span
            className="grid size-24 place-items-center rounded-full bg-white/60 text-[#ff8fa3]"
            aria-hidden="true"
          >
            <ShieldCheck size={44} fill="currentColor" strokeWidth={1.6} />
          </span>
        </div>
      </section>

      <section aria-label="약관 및 안전 안내 항목">
        <ul className="grid gap-4">
          {TERMS_SAFETY_ITEMS.map((item) => (
            <SettingsMenuItem key={item.href} {...item} />
          ))}
        </ul>
      </section>

      <div className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-5 py-4">
        <p className="flex items-start gap-3 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          법적/윤리적 안전장치는 설정에서 재확인 가능합니다. 모든 내용은 귀하의 안전과 성장을
          우선합니다.
        </p>
      </div>
    </main>
  );
}
