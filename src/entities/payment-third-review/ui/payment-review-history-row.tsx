import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, PiggyBank } from 'lucide-react';

import { getPaymentReviewFollowUpMeta } from '@/entities/payment-third-review/lib/payment-review-history-meta';
import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review/model/payment-third-review.types';
import { PaymentReviewStatusBadge } from '@/entities/payment-third-review/ui/payment-review-status-badge';

type Props = {
  href?: string;
  item: PaymentReviewHistoryRowItem;
};

export type PaymentReviewHistoryRowItem = Pick<
  PaymentReviewHistoryItem,
  'id' | 'itemName' | 'date' | 'amount' | 'impulseStrength' | 'outcomeType' | 'status' | 'followUpLabel'
>;

export function PaymentReviewHistoryRow({ href, item }: Props) {
  const decisionMeta = getDecisionMeta(item.outcomeType);
  const followUpMeta = getPaymentReviewFollowUpMeta(item);
  const Icon = decisionMeta.icon;
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-full ${decisionMeta.iconClassName}`}
          >
            <Icon size={19} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-6 text-[#1a1c1e]">
              {item.itemName}
            </p>
            <p className="truncate text-xs font-medium leading-5 text-[#72777e]">
              <span className={decisionMeta.textClassName}>{getOutcomeLabel(item.outcomeType)}</span>
              <span> · 충동 {item.impulseStrength}</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold leading-5 text-[#1a1c1e]">{item.amount}</p>
            <p className="text-[11px] font-medium leading-4 text-[#72777e]">{item.date}</p>
          </div>
          <ArrowRight size={15} strokeWidth={2.2} className="text-[#72777e]" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <PaymentReviewStatusBadge
          dotClassName={followUpMeta.dotClassName}
          label={followUpMeta.label}
        />
        <PaymentReviewStatusBadge label={item.followUpLabel} />
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-[22px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="rounded-[22px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      {content}
    </article>
  );
}

// 결제 3심 판단 유형에 맞는 아이콘과 색상 정보를 반환합니다.
function getDecisionMeta(outcomeType: PaymentReviewHistoryItem['outcomeType']) {
  if (outcomeType === 'save') {
    return {
      icon: PiggyBank,
      iconClassName: 'bg-[#e8f5f1] text-[#2d6a4f]',
      textClassName: 'text-[#2d6a4f]',
    };
  }

  if (outcomeType === 'buy') {
    return {
      icon: CheckCircle2,
      iconClassName: 'bg-[#e0f1ff] text-[#3c5f7c]',
      textClassName: 'text-[#3c5f7c]',
    };
  }

  return {
    icon: Clock3,
    iconClassName: 'bg-[#fff2e0] text-[#94640a]',
    textClassName: 'text-[#94640a]',
  };
}

// 결제 3심 현재 결과 유형을 리스트용 라벨로 변환합니다.
function getOutcomeLabel(outcomeType: PaymentReviewHistoryItem['outcomeType']) {
  if (outcomeType === 'buy') {
    return '결제';
  }

  if (outcomeType === 'save') {
    return '저축';
  }

  return '보류';
}
