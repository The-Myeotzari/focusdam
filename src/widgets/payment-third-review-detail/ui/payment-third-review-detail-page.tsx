import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarClock, CheckCircle2, PiggyBank } from 'lucide-react';

import {
  getPaymentReviewFollowUpDescription,
  getPaymentReviewFollowUpMeta,
  getPaymentReviewFollowUpTitle,
  getPaymentReviewHistoryItemById,
  PaymentReviewInfoRow,
  PaymentReviewStatusBadge,
} from '@/entities/payment-third-review';
import type { PaymentReviewHistoryItem, PaymentReviewReminderResult } from '@/entities/payment-third-review';
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
  const followUpMeta = getPaymentReviewFollowUpMeta(item);
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
          <PaymentReviewStatusBadge
            dotClassName={followUpMeta.dotClassName}
            label={followUpMeta.label}
          />
          <PaymentReviewStatusBadge label={item.followUpLabel} />
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
            <PaymentReviewStatusBadge className="!bg-white/15 !text-white" label={item.decision} />
            <PaymentReviewStatusBadge
              className="!bg-white/15 !text-white"
              label={`충동 ${item.impulseStrength}`}
            />
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
            <PaymentReviewInfoRow label="결제 이유" value={item.reason} />
            <PaymentReviewInfoRow label="목표 영향" value={item.progressLabel} />
            <PaymentReviewInfoRow label="예산 반영" value={item.budgetImpactLabel} />
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
            {getPaymentReviewFollowUpTitle(item.followUpType)}
          </p>
          <p className="mt-1 text-[17px] font-semibold leading-7 text-[#1a1c1e]">
            {getPaymentReviewFollowUpDescription(item)}
          </p>
          {item.satisfaction?.status === 'required' ? (
            <Link
              href={`/payment-third-review/satisfaction-check/${item.id}`}
              className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold leading-5 text-white"
            >
              만족도 체크하기
            </Link>
          ) : null}
          {item.reminder?.status === 'required' ? (
            <Link
              href={`/payment-third-review/reminder/${item.id}`}
              className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold leading-5 text-white"
            >
              리마인드 확인하기
            </Link>
          ) : null}
        </section>

        {item.satisfaction?.status === 'completed' && item.satisfaction.result ? (
          <section className="grid gap-3" aria-labelledby="payment-review-satisfaction-result">
            <h2
              id="payment-review-satisfaction-result"
              className="text-lg font-semibold leading-7 text-[#1a1c1e]"
            >
              만족도 조사 결과
            </h2>
            <div className="rounded-[28px] bg-white px-5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <PaymentReviewInfoRow label="체크 일자" value={item.satisfaction.result.checkedAt} />
              <PaymentReviewInfoRow
                label="만족도"
                value={`${item.satisfaction.result.summary} ${item.satisfaction.result.score}/5`}
              />
              <PaymentReviewInfoRow label="회고 메모" value={item.satisfaction.result.memo} />
            </div>
          </section>
        ) : null}

        {item.reminder?.status === 'completed' && item.reminder.result ? (
          <section className="grid gap-3" aria-labelledby="payment-review-reminder-result">
            <h2
              id="payment-review-reminder-result"
              className="text-lg font-semibold leading-7 text-[#1a1c1e]"
            >
              리마인드 결과
            </h2>
            <div className="rounded-[28px] bg-white px-5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <PaymentReviewInfoRow label="완료 일자" value={item.reminder.result.submittedAt} />
              <PaymentReviewInfoRow
                label="완료 유형"
                value={getReminderCompletedTypeLabel(item.reminder.result.completedType)}
              />
              <PaymentReviewInfoRow
                label="최종 판단"
                value={getReminderDecisionLabel(item.reminder.result.decision)}
              />
              <PaymentReviewInfoRow
                label="리마인드 횟수"
                value={`${item.reminder.result.reminderCount}회`}
              />
              <PaymentReviewInfoRow label="메모" value={item.reminder.result.memo} />
            </div>
          </section>
        ) : null}
      </main>
    </>
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

// 리마인드 완료 유형을 상세 화면용 라벨로 변환합니다.
function getReminderCompletedTypeLabel(
  completedType: PaymentReviewReminderResult['completedType'],
) {
  if (completedType === 'after-hold') {
    return '재보류 이후 완료';
  }

  return '기본 완료';
}

// 리마인드 최종 판단 값을 상세 화면용 라벨로 변환합니다.
function getReminderDecisionLabel(
  decision: PaymentReviewReminderResult['decision'],
) {
  if (decision === 'buy') {
    return '결제 진행';
  }

  if (decision === 'cancel') {
    return '결제 미진행';
  }

  return '보류';
}
