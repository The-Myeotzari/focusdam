import { CircleDollarSign } from 'lucide-react';

import { formatPaymentAmount } from '@/features/create-payment-third-review/lib/create-payment-third-review-format';
import type { CreatePaymentThirdReviewDraft } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import {
  BUDGET_GOAL_AMOUNT,
  BUDGET_PROGRESS,
} from '@/features/create-payment-third-review/model/create-payment-third-review.options';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
};

// 4단계 화면에서 결제가 목표 금액에 미치는 영향을 보여줍니다.
export function PaymentReviewStepFour({ draft }: Props) {
  return (
    <div className="grid gap-4">
      <div className="rounded-[28px] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-[#dde3eb4d] text-[#3c5f7c]">
            <CircleDollarSign size={22} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-xs font-medium leading-5 text-[#72777e]">보류 목표</span>
            <span className="block text-[26px] font-semibold leading-9 text-[#1a1c1e]">
              {BUDGET_GOAL_AMOUNT}
            </span>
          </span>
        </div>
      </div>
      <div className="rounded-[28px] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-xs font-medium leading-5 text-[#72777e]">현재 달성도</span>
            <span className="block text-[28px] font-semibold leading-9 text-[#1a1c1e]">
              {BUDGET_PROGRESS}%
            </span>
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#dadadc]">
          <div
            className="h-full rounded-full bg-[#3c5f7c]"
            style={{ width: `${BUDGET_PROGRESS}%` }}
          />
        </div>
      </div>
      <div className="rounded-[22px] bg-white/70 px-5 py-4 text-sm leading-6 text-[#72777e]">
        입력 금액 {formatPaymentAmount(draft.amount)}을 기준으로 목표 영향을 보여줍니다.
      </div>
    </div>
  );
}
