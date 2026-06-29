'use client';

import { useRouter } from 'next/navigation';
import { Banknote, Check, Circle, Clock3, XCircle } from 'lucide-react';
import { useState } from 'react';

import type {
  PaymentReviewHistoryItem,
  PaymentReviewReminderDecision,
} from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  item: PaymentReviewHistoryItem;
};

const reminderDecisionOptions: Array<{
  description: string;
  label: string;
  value: PaymentReviewReminderDecision;
}> = [
  {
    description: '24시간 뒤에도 필요하다고 판단했어요.',
    label: '결제 진행',
    value: 'buy',
  },
  {
    description: '구매하지 않고 목표를 지키기로 했어요.',
    label: '결제 미진행',
    value: 'cancel',
  },
  {
    description: '지금 당장 결정하지 않으셔도 됩니다. 보류 선택하면 3일 뒤 리마인드 됩니다.',
    label: '보류',
    value: 'hold',
  },
];

// 24시간 보류 후 다시 결제 판단을 선택하는 리마인드 화면을 렌더링합니다.
export function PaymentThirdReviewReminderPage({ item }: Props) {
  const router = useRouter();
  const [selectedDecision, setSelectedDecision] = useState<PaymentReviewReminderDecision | null>(
    null,
  );

  // 선택한 리마인드 판단에 맞는 최종 제출 화면으로 이동합니다.
  const handleNext = () => {
    if (!selectedDecision) {
      return;
    }

    router.push(`/payment-third-review/reminder/${item.id}/result/${selectedDecision}`);
  };

  return (
    <>
      <SiteTopBar
        title="결제 3심"
        backHref={`/payment-third-review/list/${item.id}`}
        skipHref="/payment-third-review"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section className="rounded-[32px] bg-[#fff2e0] p-6">
          <span className="grid size-14 place-items-center rounded-full bg-white/70 text-[#94640a]">
            <Clock3 size={28} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-semibold leading-6 text-[#94640a]">{item.itemName}</p>
          <h1 className="mt-1 text-[30px] font-semibold leading-[40px] text-[#1a1c1e]">
            24시간이 지났어요.
            <br />
            어떻게 할까요?
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#595f66]">
            {item.amount} 결제를 다시 확인하고 지금의 판단을 남겨요.
          </p>
        </section>

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
                onClick={() => setSelectedDecision(option.value)}
              />
            ))}
          </div>
        </section>

        <div className="mt-auto grid gap-2 pt-4">
          <button
            type="button"
            onClick={handleNext}
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
        </div>
      </main>
    </>
  );
}

// 리마인드 판단 선택 카드를 렌더링합니다.
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

// 리마인드 판단 값에 맞는 아이콘을 반환합니다.
function getReminderDecisionIcon(value: PaymentReviewReminderDecision) {
  if (value === 'buy') {
    return Banknote;
  }

  if (value === 'cancel') {
    return XCircle;
  }

  return Clock3;
}
