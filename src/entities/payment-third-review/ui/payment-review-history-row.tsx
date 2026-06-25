import { ArrowRight, CheckCircle2, Clock3 } from 'lucide-react';

import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';

type Props = {
  item: PaymentReviewHistoryItem;
};

export function PaymentReviewHistoryRow({ item }: Props) {
  const isSuccess = item.statusTone === 'success';
  const iconClassName = isSuccess
    ? 'bg-[#e8f5f1] text-[#2d6a4f]'
    : 'bg-[#fff2e0] text-[#94640a]';
  const Icon = isSuccess ? CheckCircle2 : Clock3;

  return (
    <article className="flex items-center justify-between gap-3 rounded-[22px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${iconClassName}`}>
          <Icon size={20} strokeWidth={2.1} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold leading-6 text-[#1a1c1e]">{item.title}</p>
            <span className="shrink-0 text-[11px] font-medium leading-4 text-[#72777e]">
              {item.date}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs leading-5 text-[#72777e]">
            {item.statusLabel} · {item.amount} · {item.progressLabel}
          </p>
        </div>
      </div>

      <ArrowRight
        size={16}
        strokeWidth={2.2}
        className="shrink-0 text-[#72777e]"
        aria-hidden="true"
      />
    </article>
  );
}
