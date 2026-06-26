import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, PiggyBank } from 'lucide-react';

import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';

type Props = {
  href?: string;
  item: PaymentReviewHistoryItem;
};

export function PaymentReviewHistoryRow({ href, item }: Props) {
  const decisionMeta = getDecisionMeta(item.decisionType);
  const followUpMeta = getFollowUpMeta(item.followUpType);
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
              {item.decision} · 충동 {item.impulseStrength}
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
        <StatusBadge className={followUpMeta.className} label={followUpMeta.label} />
        <StatusBadge className="bg-[#f4f3f6] text-[#72777e]" label={item.followUpLabel} />
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
function getDecisionMeta(decisionType: PaymentReviewHistoryItem['decisionType']) {
  if (decisionType === 'save') {
    return {
      icon: PiggyBank,
      iconClassName: 'bg-[#e8f5f1] text-[#2d6a4f]',
      textClassName: 'text-[#2d6a4f]',
    };
  }

  if (decisionType === 'buy') {
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

// 결제 3심 결과 카드의 작은 상태 배지를 렌더링합니다.
function StatusBadge({ className, label }: { className: string; label: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ${className}`}>
      {label}
    </span>
  );
}
