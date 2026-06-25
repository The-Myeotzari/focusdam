import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { COMPLETE_REPORT_ICON } from '@/features/create-payment-third-review/model/create-payment-third-review.steps';
import { FINAL_DECISION_OPTIONS } from '@/features/create-payment-third-review/model/create-payment-third-review.options';
import {
  formatImpulseStrength,
  formatPaymentAmount,
} from '@/features/create-payment-third-review/lib/create-payment-third-review-format';
import {
  ChoiceCard,
  SummaryRow,
} from '@/features/create-payment-third-review/ui/create-payment-third-review-cards';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

// 최종 화면에서 선택지와 전송 전 요약 정보를 보여줍니다.
export function PaymentReviewCompleteStep({ draft, updateDraft }: Props) {
  const ReportIcon = COMPLETE_REPORT_ICON;
  const decisionLabel =
    FINAL_DECISION_OPTIONS.find((choice) => choice.id === draft.decision)?.title ?? '24시간 보류';
  const summaryItems = [
    { label: '품목', value: draft.itemName || '미입력' },
    { label: '금액', value: formatPaymentAmount(draft.amount) },
    { label: '충동 강도', value: formatImpulseStrength(draft.impulseStrength) },
    { label: '판단', value: decisionLabel },
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {FINAL_DECISION_OPTIONS.map((choice) => (
          <ChoiceCard
            key={choice.id}
            checked={draft.decision === choice.id}
            title={choice.title}
            description={choice.description}
            onClick={() => updateDraft({ decision: choice.id })}
          />
        ))}
      </div>
      <div className="rounded-[30px] bg-[#3c5f7c] p-5 text-white shadow-[0_16px_34px_rgba(60,95,124,0.16)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-semibold leading-8">결제 3심 리포트</h2>
          <span className="grid size-10 place-items-center rounded-full bg-white/15">
            <ReportIcon size={20} strokeWidth={2.1} aria-hidden="true" />
          </span>
        </div>
        <dl className="mt-4 grid gap-3 text-sm leading-6">
          {summaryItems.map((item) => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </dl>
      </div>
    </div>
  );
}
