import { BellRing, CheckCircle2, ClipboardList, PiggyBank } from 'lucide-react';

import type { CreatePaymentThirdReviewDraft } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { FINAL_DECISION_OPTIONS } from '@/features/create-payment-third-review/model/create-payment-third-review.options';
import {
  formatImpulseStrength,
  formatPaymentAmount,
  formatSavingTarget,
} from '@/features/create-payment-third-review/lib/create-payment-third-review-format';
import { SummaryRow } from '@/features/create-payment-third-review/ui/create-payment-third-review-cards';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
};

// 최종 제출 직전에 결제 3심 리포트 요약 카드를 보여줍니다.
export function PaymentReviewReportStep({ draft }: Props) {
  const decisionLabel =
    FINAL_DECISION_OPTIONS.find((choice) => choice.id === draft.decision)?.title ?? '24시간 보류';
  const summaryItems = [
    { label: '품목', value: draft.itemName || '미입력' },
    { label: '금액', value: formatPaymentAmount(draft.amount) },
    { label: '충동 강도', value: formatImpulseStrength(draft.impulseStrength) },
    { label: '판단', value: decisionLabel },
  ];
  const detail = getReportDetail(draft);

  return (
    <div className="grid gap-4">
      <section className="rounded-[32px] bg-[#3c5f7c] p-6 text-white shadow-[0_16px_34px_rgba(60,95,124,0.16)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[28px] font-semibold leading-9">결제 3심 리포트</h2>
          <span className="grid size-16 place-items-center rounded-full bg-white/15">
            <ClipboardList size={30} strokeWidth={2.1} aria-hidden="true" />
          </span>
        </div>
        <dl className="mt-8 grid gap-5 text-[17px] leading-7">
          {summaryItems.map((item) => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </dl>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dde3eb4d] text-[#3c5f7c]">
            <detail.icon size={23} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold leading-5 text-[#72777e]">{detail.label}</p>
            <h3 className="mt-1 text-[20px] font-semibold leading-7 text-[#1a1c1e]">
              {detail.title}
            </h3>
            <p className="mt-2 text-sm font-medium leading-6 text-[#72777e]">
              {detail.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// 선택한 최종 판단에 맞는 리포트 상세 문구를 반환합니다.
function getReportDetail(draft: CreatePaymentThirdReviewDraft) {
  if (draft.decision === 'hold') {
    return {
      icon: BellRing,
      label: '24시간 보류',
      title: '오늘은 결제를 미루고 판단을 저장합니다.',
      description:
        '24시간 뒤 리마인드에서 보류 전용 화면을 열어 실제 필요가 남아있는지 다시 확인합니다.',
    };
  }

  if (draft.decision === 'memo') {
    return {
      icon: PiggyBank,
      label: '목표 저축',
      title: `${formatSavingTarget(draft.savingTarget)}에 반영합니다.`,
      description: '아낀 금액은 목표 달성률과 소비 기록에 연결되어 다음 선택의 기준이 됩니다.',
    };
  }

  return {
    icon: CheckCircle2,
    label: '그래도 결제',
    title: draft.buyReason || '결제 이유를 기록했습니다.',
    description:
      '그래도 결제를 진행했으므로 24시간 뒤 만족도 체크를 예약하고 이번 달 소비에 반영합니다.',
  };
}
