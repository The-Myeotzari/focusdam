import { ArrowRight, Flag } from 'lucide-react';

import { SiteButton, SiteInput, SiteTopBar } from '@/shared/ui';

// 결제 3심 목표 금액을 설정하는 UI 화면을 렌더링합니다.
export function PaymentThirdReviewGoalSettingPage() {
  return (
    <>
      <SiteTopBar
        title="목표 설정"
        backHref="/payment-third-review"
        skipHref="/payment-third-review"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section className="rounded-[32px] bg-[#e6f4f1] px-5 py-6">
          <span className="grid size-12 place-items-center rounded-full bg-white text-[#3c5f7c] shadow-[0_8px_18px_rgba(60,95,124,0.08)]">
            <Flag size={24} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-[26px] font-semibold leading-9 text-[#1a1c1e]">
            결제 3심 목표 금액을
            <br />
            설정해요
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-[#5f656c]">
            이번 달 결제 전 점검에서 비교할 기준 금액입니다.
          </p>
        </section>

        <label className="grid gap-2">
          <span className="text-xs font-medium leading-5 text-[#72777e]">목표 금액</span>
          <span className="relative block">
            <SiteInput
              inputMode="numeric"
              placeholder="예: 86,000"
              className="!min-h-[64px] !rounded-[24px] !border-transparent !py-0 !pl-5 !pr-12 !text-[24px] !font-semibold !leading-8 !shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[20px] font-semibold leading-7 text-[#72777e]">
              원
            </span>
          </span>
        </label>

        <div className="mt-auto grid gap-2 pt-4">
          <SiteButton
            href="/payment-third-review"
            className="!min-h-[62px] !w-full !gap-2 !rounded-full !px-6 !text-[17px] !font-semibold"
          >
            목표 금액 저장
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </SiteButton>
          <SiteButton
            href="/payment-third-review"
            variant="secondary"
            className="!min-h-12 !w-full !rounded-full !text-sm !font-semibold"
          >
            돌아가기
          </SiteButton>
        </div>
      </main>
    </>
  );
}
