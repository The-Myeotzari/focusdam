// 신규 회원 전용 홈 화면

import { RecommendedAction } from '@/features/create-starter';
import { SiteButton, SiteCard } from '@/shared/ui';
import { Info } from 'lucide-react';

export function NewUserHome() {
  return (
    <>
      {/* 신규 회원 전용 main-hero */}
      <section id="new-user-main-hero" className="flex gap-8 flex-col">
        <div>
          <h1 className="text-[32px] font-normal leading-[1.25] tracking-[-0.035em] text-[var(--color-on-surface)]">
            안녕하세요!
            <br />
            오늘부터 시작해볼까요?
          </h1>
          <p className="mt-2 text-base leading-[1.6] tracking-[-0.02em] text-[var(--color-on-surface-variant)]">
            괜찮아요, 지금 할 수 있는 것부터 작게 시작해요.
          </p>
        </div>
        <SiteCard>
          <p className="m-0 text-xs font-bold leading-[1.4] tracking-[0.02em] text-[var(--color-primary)]">
            TODAY&apos;S FOCUS
          </p>
          <h2 className="mb-0 mt-1 text-[26px] font-normal leading-[1.35] tracking-[-0.035em] text-[var(--color-on-surface)]">
            첫 10분 행동을
            <br />
            만들어볼까요?
          </h2>
          <SiteButton
            href="/starter/new"
            variant="primary"
            className="mt-6 w-full !min-h-12 !border-0 !bg-[#466d8d] !text-sm !font-medium !shadow-[0_4px_8px_rgba(60,95,124,0.2)] hover:!bg-[var(--color-primary)]"
          >
            첫 스타터 만들기
          </SiteButton>
          <div className="my-8 h-px bg-[#c2c7ce47]" />

          <RecommendedAction />
        </SiteCard>
      </section>

      {/* 신규 회원 전용 main-info */}
      <aside
        id="new-user-main-info"
        className="grid grid-cols-[24px_1fr] gap-4 rounded-[32px] bg-[#eeedf0d1] px-5 py-7 text-[var(--color-outline)]"
      >
        <Info
          size={24}
          strokeWidth={1.8}
          className="text-[var(--color-primary)]"
          aria-hidden="true"
        />
        <p className="m-0 text-sm leading-[1.6] tracking-[-0.01em]">
          처음에는 아주 쉬운 일부터 등록해보세요. 기록이 쌓일수록 당신의 집중력 지도가 선명해집니다.
        </p>
      </aside>
    </>
  );
}
