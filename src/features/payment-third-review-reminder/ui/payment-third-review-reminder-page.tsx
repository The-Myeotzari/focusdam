'use client';

import { useQuery } from '@tanstack/react-query';
import { Banknote, Check, Circle, Clock3, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { paymentThirdReviewDetailQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { mapPaymentThirdReviewDetailToHistoryItem } from '@/entities/payment-third-review/lib/payment-review-detail-item';
import type {
  PaymentReviewHistoryItem,
  PaymentReviewReminderDecision,
} from '@/entities/payment-third-review';
import { ApiRequestError } from '@/shared/lib/api/api';
import { SiteTopBar } from '@/shared/ui';

type Props = { id: string };

const reminderDecisionOptions: Array<{
  description: string;
  label: string;
  value: PaymentReviewReminderDecision;
}> = [
  {
    description: '시간이 지난 뒤에도 필요하다고 판단했어요.',
    label: '결제 진행',
    value: 'buy',
  },
  {
    description: '구매하지 않고 연결된 목표를 지키기로 했어요.',
    label: '결제 미진행',
    value: 'cancel',
  },
  {
    description: '조금 더 고민하고 3일 뒤 다시 확인해요.',
    label: '보류',
    value: 'hold',
  },
];

export function PaymentThirdReviewReminderPage({ id }: Props) {
  const router = useRouter();
  const [selectedDecision, setSelectedDecision] =
    useState<PaymentReviewReminderDecision | null>(null);
  const detailQuery = useQuery({
    ...paymentThirdReviewDetailQueryOptions(id),
    select: (response) => mapPaymentThirdReviewDetailToHistoryItem(response.item),
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.body.status === 404) && failureCount < 2,
  });
  const item = detailQuery.data;
  const invalidReminderTarget = item && (item.followUpType !== 'reminder' || !item.reminder);

  const handleNext = () => {
    if (selectedDecision && item?.reminder?.status === 'required') {
      router.push(`/payment-third-review/reminder/${id}/result/${selectedDecision}`);
    }
  };

  return (
    <>
      <SiteTopBar
        title="결제 3심"
        backHref={`/payment-third-review/list/${id}`}
        skipHref="/payment-third-review"
      />
      {detailQuery.isPending ? (
        <ReminderPageSkeleton />
      ) : detailQuery.isError || invalidReminderTarget ? (
        <ReminderLoadError
          notFound={
            invalidReminderTarget ||
            (detailQuery.error instanceof ApiRequestError && detailQuery.error.body.status === 404)
          }
          onRetry={() => void detailQuery.refetch()}
        />
      ) : item ? (
        <ReminderContent
          item={item}
          selectedDecision={selectedDecision}
          onDecisionChange={setSelectedDecision}
          onNext={handleNext}
        />
      ) : null}
    </>
  );
}

function ReminderContent({
  item,
  selectedDecision,
  onDecisionChange,
  onNext,
}: {
  item: PaymentReviewHistoryItem;
  selectedDecision: PaymentReviewReminderDecision | null;
  onDecisionChange: (decision: PaymentReviewReminderDecision) => void;
  onNext: () => void;
}) {
  const reminderStatus = item.reminder?.status;
  const isRequired = reminderStatus === 'required';

  return (
    <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
      <section className="rounded-[32px] bg-[#fff2e0] p-6">
        <span className="grid size-14 place-items-center rounded-full bg-white/70 text-[#94640a]">
          <Clock3 size={28} strokeWidth={2.1} aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold leading-6 text-[#94640a]">{item.itemName}</p>
        <h1 className="mt-1 text-[30px] font-semibold leading-[40px] text-[#1a1c1e]">
          다시 확인할 시간이
          <br />
          되었어요.
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#595f66]">
          {item.amount} 결제를 다시 확인하고 지금의 판단을 남겨요.
        </p>
      </section>

      {isRequired ? (
        <section className="grid gap-3" aria-labelledby="payment-review-reminder-options">
          <h2
            id="payment-review-reminder-options"
            className="text-lg font-semibold leading-7 text-[#1a1c1e]"
          >
            다시 판단하기
          </h2>
          <div className="grid gap-2">
            {reminderDecisionOptions.map((option) => (
              <ReminderDecisionCard
                key={option.value}
                checked={selectedDecision === option.value}
                description={option.description}
                label={option.label}
                value={option.value}
                onClick={() => onDecisionChange(option.value)}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-[26px] border border-[#e4e7eb] bg-white/60 px-5 py-5">
          <p className="text-sm font-semibold text-[#72777e]">
            {reminderStatus === 'completed' ? '판단 완료' : '리마인드 예정'}
          </p>
          <p className="mt-1 text-[17px] font-semibold leading-7 text-[#1a1c1e]">
            {reminderStatus === 'completed'
              ? '이미 이 리마인드의 판단을 완료했어요.'
              : `${item.followUpLabel} 다시 판단할 수 있어요.`}
          </p>
        </section>
      )}

      <div className="mt-auto grid gap-2 pt-4">
        {isRequired ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedDecision}
            className={[
              'flex min-h-[62px] w-full items-center justify-center rounded-full px-6 text-[17px] font-semibold leading-7 text-white',
              selectedDecision
                ? 'bg-[#3c5f7c] shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]'
                : 'cursor-not-allowed bg-[#d7dde3]',
            ].join(' ')}
          >
            다음
          </button>
        ) : (
          <Link
            href={`/payment-third-review/list/${item.id}`}
            className="flex min-h-[62px] items-center justify-center rounded-full bg-[#3c5f7c] px-6 text-[17px] font-semibold text-white"
          >
            상세로 돌아가기
          </Link>
        )}
      </div>
    </main>
  );
}

function ReminderDecisionCard({
  checked,
  description,
  label,
  onClick,
  value,
}: {
  checked: boolean;
  description: string;
  label: string;
  onClick: () => void;
  value: PaymentReviewReminderDecision;
}) {
  const Icon = getReminderDecisionIcon(value);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex min-h-[100px] items-center gap-3 rounded-[28px] border bg-white p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.04)]',
        checked ? 'border-[#3c5f7c]' : 'border-transparent',
      ].join(' ')}
      aria-pressed={checked}
    >
      <span
        className={[
          'grid size-11 shrink-0 place-items-center rounded-full',
          checked ? 'bg-[#dde3eb] text-[#3c5f7c]' : 'bg-[#f4f3f6] text-[#72777e]',
        ].join(' ')}
        aria-hidden="true"
      >
        <Icon size={20} strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold leading-7 text-[#1a1c1e]">{label}</span>
        <span className="block text-sm leading-6 text-[#72777e]">{description}</span>
      </span>
      <span className="grid size-6 shrink-0 place-items-center text-[#3c5f7c]" aria-hidden="true">
        {checked ? <Check size={18} strokeWidth={2.4} /> : <Circle size={18} strokeWidth={2.1} />}
      </span>
    </button>
  );
}

function ReminderPageSkeleton() {
  return (
    <main
      className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] animate-pulse gap-5 px-5 pb-8 pt-4"
      role="status"
      aria-label="리마인드 정보를 불러오는 중입니다."
    >
      <div className="h-64 rounded-[32px] bg-[#f3e8d8]" aria-hidden="true" />
      <div className="grid gap-2" aria-hidden="true">
        <span className="h-7 w-28 rounded-full bg-[#e5e8eb]" />
        <span className="h-[100px] rounded-[28px] bg-white" />
        <span className="h-[100px] rounded-[28px] bg-white" />
        <span className="h-[100px] rounded-[28px] bg-white" />
      </div>
    </main>
  );
}

function ReminderLoadError({ notFound, onRetry }: { notFound: boolean; onRetry: () => void }) {
  return (
    <main className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] place-content-center px-5 py-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#fff2e0] text-[#94640a]">
        <Clock3 size={26} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-[#1a1c1e]">
        {notFound ? '리마인드 대상을 찾을 수 없어요' : '정보를 불러오지 못했어요'}
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#72777e]">
        {notFound ? '삭제되었거나 리마인드 대상이 아닌 내역이에요.' : '잠시 후 다시 시도해주세요.'}
      </p>
      {notFound ? (
        <Link
          href="/payment-third-review/list"
          className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
        >
          목록으로 돌아가기
        </Link>
      ) : (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 min-h-12 rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
        >
          다시 불러오기
        </button>
      )}
    </main>
  );
}

function getReminderDecisionIcon(value: PaymentReviewReminderDecision) {
  if (value === 'buy') return Banknote;
  if (value === 'cancel') return XCircle;
  return Clock3;
}
