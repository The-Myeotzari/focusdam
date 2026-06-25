import { BellRing, CalendarClock, SmilePlus } from 'lucide-react';

import type { CreatePaymentThirdReviewDraft } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
};

// 그래도 결제 이후 24시간 뒤 만족도 체크 예약 안내를 보여줍니다.
export function PaymentReviewSatisfactionCheckStep({ draft }: Props) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[32px] bg-[#e6f4f1] px-5 py-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-white text-[#3c5f7c] shadow-[0_8px_18px_rgba(60,95,124,0.08)]">
          <SmilePlus size={30} strokeWidth={2.1} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-[24px] font-semibold leading-8 text-[#1a1c1e]">
          24시간 뒤 만족도를
          <br />
          다시 확인할게요
        </h2>
        <p className="mt-4 text-sm font-medium leading-6 text-[#5f656c]">
          {draft.itemName || '이 결제'}가 실제로 만족스러웠는지 하루 뒤에 체크합니다.
        </p>
      </section>

      <article className="rounded-[28px] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dde3eb4d] text-[#3c5f7c]">
            <CalendarClock size={23} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-xs font-semibold leading-5 text-[#72777e]">체크 시점</span>
            <span className="block text-[22px] font-semibold leading-8 text-[#1a1c1e]">
              24시간 뒤
            </span>
          </span>
        </div>
      </article>

      <article className="rounded-[28px] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#fff1d6] text-[#8a5b17]">
            <BellRing size={23} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[18px] font-semibold leading-7 text-[#1a1c1e]">
              만족도 회고 예약
            </span>
            <span className="mt-1 block text-sm font-medium leading-6 text-[#72777e]">
              결제 직후의 확신이 하루 뒤에도 유지되는지 확인하고 다음 소비 판단에 반영합니다.
            </span>
          </span>
        </div>
      </article>
    </div>
  );
}
