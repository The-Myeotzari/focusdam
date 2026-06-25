import { Banknote, Gauge } from 'lucide-react';

import type {
  PaymentReviewOverview,
  SummaryCard,
} from '@/widgets/payment-third-review-home/model/payment-third-review-home.types';

export const PAYMENT_REVIEW_OVERVIEW: PaymentReviewOverview = {
  goalAmount: '86,000원',
  currentSpend: '62,000원',
  progressLabel: '목표 대비 72%',
  statusLabel: '목표 안에서 사용 중',
};

export const SUMMARY_CARDS: SummaryCard[] = [
  {
    title: '현재 소비',
    value: PAYMENT_REVIEW_OVERVIEW.currentSpend,
    description: '이번 결제 3심 기준',
    icon: Banknote,
    tone: 'bg-[#e8f5f1] text-[#2d6a4f]',
  },
  {
    title: '목표 대비',
    value: '72%',
    description: '안정권이에요',
    icon: Gauge,
    tone: 'bg-[#f3f0ff] text-[#645785]',
  },
];
