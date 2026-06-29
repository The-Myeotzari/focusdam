import { CalendarClock, FileText } from 'lucide-react';

import { formatPaymentAmount } from '@/features/create-payment-third-review/lib/create-payment-third-review-format';
import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import type { ReactNode } from 'react';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

// 그래도 결제 판단 이후 사용자가 결제 이유를 직접 입력하게 합니다.
export function PaymentReviewBuyStep({ draft, updateDraft }: Props) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[32px] bg-[#ececee] px-5 py-6">
        <p className="text-xs font-semibold leading-5 text-[#72777e]">그래도 결제</p>
        <h2 className="mt-4 text-[24px] font-semibold leading-8 text-[#1a1c1e]">
          결제 이유를
          <br />
          짧게 남길까요?
        </h2>
        <p className="mt-4 text-sm font-medium leading-6 text-[#5f656c]">
          필요한 소비라면 기록하고 후회 방지 회고만 예약합니다.
        </p>
      </section>

      <label className="grid gap-2">
        <span className="text-xs font-medium leading-5 text-[#72777e]">결제 이유</span>
        <textarea
          value={draft.buyReason}
          onChange={(event) => updateDraft({ buyReason: event.target.value })}
          placeholder={`${draft.itemName || '이 품목'}을 결제하려는 이유를 적어주세요.`}
          className="min-h-[144px] resize-none rounded-[28px] border border-transparent bg-white px-5 py-4 text-[18px] font-semibold leading-7 text-[#1a1c1e] shadow-[0_4px_12px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#a5abb1] focus:border-[#3c5f7c]"
        />
      </label>
      <BuyRecordCard
        icon={<CalendarClock size={22} strokeWidth={2.1} />}
        label="다음 단계"
        title="24시간 뒤 만족도 체크"
        description="그래도 결제를 진행하면 하루 뒤 실제 만족도를 다시 확인합니다."
      />
      <BuyRecordCard
        icon={<FileText size={22} strokeWidth={2.1} />}
        label="예산 반영"
        title="이번 달 소비에 기록"
        description={`${formatPaymentAmount(draft.amount)}을 예산 항목에 분류합니다.`}
      />
    </div>
  );
}

type BuyRecordCardProps = {
  description: string;
  icon: ReactNode;
  label: string;
  title: string;
};

// 그래도 결제 화면의 기록 항목 카드를 렌더링합니다.
function BuyRecordCard({ description, icon, label, title }: BuyRecordCardProps) {
  return (
    <article className="flex min-h-[110px] items-start gap-4 rounded-[28px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <span
        className="grid size-11 shrink-0 place-items-center rounded-full bg-[#dde3eb4d] text-[#3c5f7c]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold leading-5 text-[#72777e]">{label}</span>
        <span className="block text-[20px] font-semibold leading-7 text-[#1a1c1e]">{title}</span>
        <span className="mt-2 block text-sm font-medium leading-6 text-[#72777e]">
          {description}
        </span>
      </span>
    </article>
  );
}
