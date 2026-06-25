import type { PaymentReviewHistoryItem } from './payment-third-review.types';

export const PAYMENT_REVIEW_HISTORY_ITEMS: PaymentReviewHistoryItem[] = [
  {
    id: 'review-2026-06-24',
    title: '이번 결제 3심',
    date: '오늘',
    amount: '62,000원',
    progressLabel: '목표 대비 72%',
    statusLabel: '목표 안에서 사용 중',
    statusTone: 'success',
  },
  {
    id: 'review-2026-06-21',
    title: '생활비 점검',
    date: '6월 21일',
    amount: '78,400원',
    progressLabel: '목표 대비 91%',
    statusLabel: '조금만 더 신중하게',
    statusTone: 'caution',
  },
  {
    id: 'review-2026-06-18',
    title: '카페 소비 점검',
    date: '6월 18일',
    amount: '24,600원',
    progressLabel: '목표 대비 64%',
    statusLabel: '목표 안에서 사용 중',
    statusTone: 'success',
  },
  {
    id: 'review-2026-06-15',
    title: '장보기 전 확인',
    date: '6월 15일',
    amount: '53,200원',
    progressLabel: '목표 대비 76%',
    statusLabel: '목표 안에서 사용 중',
    statusTone: 'success',
  },
  {
    id: 'review-2026-06-12',
    title: '구독 결제 점검',
    date: '6월 12일',
    amount: '19,900원',
    progressLabel: '목표 대비 88%',
    statusLabel: '조금만 더 신중하게',
    statusTone: 'caution',
  },
];
