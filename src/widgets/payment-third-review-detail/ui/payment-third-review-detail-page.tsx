import { notFound } from 'next/navigation';
import { CalendarClock, CheckCircle2, PiggyBank } from 'lucide-react';

import { getPaymentReviewHistoryItemById } from '@/entities/payment-third-review';
import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  id: string;
};

// 선택한 결제 3심 기록의 상세 리포트 화면을 렌더링합니다.
export function PaymentThirdReviewDetailPage({ id }: Props) {
  const item = getPaymentReviewHistoryItemById(id);

  if (!item) {
    notFound();
  }

  const decisionMeta = getDecisionMeta(item.decisionType);
  const followUpMeta = getFollowUpMeta(item.followUpType);
  const Icon = decisionMeta.icon;

  return (
    <>
      <SiteTopBar
        title="결제 3심 상세"
        backHref="/payment-third-review/list"
        skipHref="/payment-third-review"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge className={followUpMeta.className} label={followUpMeta.label} />
          <StatusBadge className="bg-[#f4f3f6] text-[#72777e]" label={item.followUpLabel} />
        </div>

        <section className="rounded-[32px] bg-[#3c5f7c] p-6 text-white shadow-[0_16px_34px_rgba(60,95,124,0.16)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold leading-6 text-white/70">{item.date}</p>
              <h1 className="mt-1 text-[28px] font-semibold leading-9">{item.itemName}</h1>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/15">
              <Icon size={28} strokeWidth={2.1} aria-hidden="true" />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-1.5">
            <StatusBadge className="bg-white/15 text-white" label={item.decision} />
            <StatusBadge className="bg-white/15 text-white" label={`충동 ${item.impulseStrength}`} />
          </div>
          <p className="mt-8 text-[30px] font-semibold leading-9">{item.amount}</p>
        </section>

        <section className="grid gap-3" aria-labelledby="payment-review-detail-summary">
          <h2
            id="payment-review-detail-summary"
            className="text-lg font-semibold leading-7 text-[#1a1c1e]"
          >
            판단 요약
          </h2>

          <div className="rounded-[28px] bg-white px-5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <SummaryRow label="결제 이유" value={item.reason} />
            <SummaryRow label="목표 영향" value={item.progressLabel} />
            <SummaryRow label="예산 반영" value={item.budgetImpactLabel} />
          </div>
        </section>

        <section
          className="rounded-[26px] border border-[#e4e7eb] bg-white/55 px-5 py-4"
          aria-labelledby="payment-review-detail-follow-up"
        >
          <p
            id="payment-review-detail-follow-up"
            className="text-xs font-semibold leading-5 text-[#72777e]"
          >
            {getFollowUpTitle(item.followUpType)}
          </p>
          <p className="mt-1 text-[17px] font-semibold leading-7 text-[#1a1c1e]">
            {getFollowUpDescription(item)}
          </p>
        </section>
      </main>
    </>
  );
}

// 판단 요약 안의 구분선 행을 렌더링합니다.
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#eceff2] py-4 last:border-b-0">
      <p className="shrink-0 text-sm font-medium leading-6 text-[#72777e]">{label}</p>
      <p className="text-right text-[16px] font-semibold leading-6 text-[#1a1c1e]">{value}</p>
    </div>
  );
}

// 결제 3심 판단 유형에 맞는 아이콘 정보를 반환합니다.
function getDecisionMeta(decisionType: PaymentReviewHistoryItem['decisionType']) {
  if (decisionType === 'save') {
    return { icon: PiggyBank };
  }

  if (decisionType === 'buy') {
    return { icon: CheckCircle2 };
  }

  return { icon: CalendarClock };
}

// 결제 3심 후속 처리 유형에 맞는 배지 정보를 반환합니다.
function getFollowUpMeta(followUpType: PaymentReviewHistoryItem['followUpType']) {
  if (followUpType === 'satisfaction') {
    return {
      label: '만족도 체크 예정',
      className: 'bg-[#e0f1ff] text-[#3c5f7c]',
    };
  }

  if (followUpType === 'saved') {
    return {
      label: '저축 반영',
      className: 'bg-[#e8f5f1] text-[#2d6a4f]',
    };
  }

  return {
    label: '리마인드 예정',
    className: 'bg-[#fff2e0] text-[#94640a]',
  };
}

// 후속 처리 유형에 맞는 상세 제목을 반환합니다.
function getFollowUpTitle(followUpType: PaymentReviewHistoryItem['followUpType']) {
  if (followUpType === 'satisfaction') {
    return '만족도 체크';
  }

  if (followUpType === 'saved') {
    return '저축 반영';
  }

  return '리마인드';
}

// 후속 처리 유형에 맞는 상세 문장을 반환합니다.
function getFollowUpDescription(item: PaymentReviewHistoryItem) {
  if (item.followUpType === 'satisfaction') {
    return `${item.followUpLabel} 만족도를 확인해요`;
  }

  if (item.followUpType === 'saved') {
    return `${item.followUpLabel}으로 이동했어요`;
  }

  return `${item.followUpLabel} 다시 확인해요`;
}

// 결제 3심 상세 상단의 상태 배지를 렌더링합니다.
function StatusBadge({ className, label }: { className: string; label: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ${className}`}>
      {label}
    </span>
  );
}
